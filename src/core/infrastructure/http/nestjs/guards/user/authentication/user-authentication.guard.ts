import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { PUBLIC_ROUTE, PublicRouteOptions } from '@core/infrastructure/http/nestjs/decorators/public-route';

@Injectable()
export class UserAuthenticationGuard extends AuthGuard('auth-routes') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<any>(PUBLIC_ROUTE, [
      context.getHandler(),
      context.getClass(),
    ]) as PublicRouteOptions;
    if (isPublic?.active === true) {
      return true;
    }
    return super.canActivate(context);
  }
}
