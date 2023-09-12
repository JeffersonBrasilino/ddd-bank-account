import { AbstractError } from '@core/domain/errors';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  PUBLIC_ROUTE,
  PublicRouteOptions,
} from '@core/infrastructure/http/nestjs/decorators/public-route';
import { ApplicationGuardDataProviderInterface } from './application-guard.data-provider.interface';

@Injectable()
export class ApplicationAuthenticationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private dataProvider: ApplicationGuardDataProviderInterface,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<any>(PUBLIC_ROUTE, [
      context.getHandler(),
      context.getClass(),
    ]) as PublicRouteOptions;
    if (isPublic?.checkAppAuthorization === false) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (token == undefined) {
      throw new UnauthorizedException('header app-auth-token is required');
    }
    const applicationId = await this.dataProvider.getApplicationByPublicKey(
      token,
    );
    if (applicationId instanceof AbstractError) {
      throw new UnauthorizedException('invalid app-auth-token header');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    if (
      request.headers['app-auth-token'] == undefined ||
      request.headers['app-auth-token'] == ''
    ) {
      return undefined;
    }
    return request.headers['app-auth-token'];
  }
}
