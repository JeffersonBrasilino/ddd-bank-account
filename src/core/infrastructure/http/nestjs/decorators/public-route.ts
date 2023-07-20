import { SetMetadata } from '@nestjs/common';

interface PublicRouteOptions {
  checkAppAuthorization: boolean;
}

export const PUBLIC_ROUTE = { checkAppAuthorization: true, active: true };
export const PublicRoute = (options?: PublicRouteOptions) => {
  return SetMetadata(PUBLIC_ROUTE, {
    checkAppAuthorization: options?.checkAppAuthorization ?? true,
    active: true,
  });
};
