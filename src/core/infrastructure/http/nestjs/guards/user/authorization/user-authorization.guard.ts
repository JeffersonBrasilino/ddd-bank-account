import {
  PUBLIC_ROUTE,
  PublicRouteOptions,
} from '@core/infrastructure/http/nestjs/decorators/public-route';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserAuthorizationDataProviderInterface } from './user-authorization.data-provider.interface';
import { AbstractError } from '@core/domain/errors';

@Injectable()
export class UserAuthorizationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private dataProvider: UserAuthorizationDataProviderInterface,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<any>(PUBLIC_ROUTE, [
      context.getHandler(),
      context.getClass(),
    ]) as PublicRouteOptions;
    if (isPublic?.active === true) {
      return true;
    }

    const { user, method, route, headers } = context
      .switchToHttp()
      .getRequest();

    const appToken = headers['app-auth-token'] ?? '';
    const permission = await this.dataProvider.checkPermissionRouteByUser(
      user.userId,
      route.path,
      method,
      appToken,
    );
    if (permission instanceof AbstractError) {
      throw new ForbiddenException('error checking permissions for user');
    }

    return permission;
  }
}
