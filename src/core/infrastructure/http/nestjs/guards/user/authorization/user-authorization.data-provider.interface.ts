import { InfrastructureError } from '@core/infrastructure/errors';

export interface UserAuthorizationDataProviderInterface {
  checkPermissionRouteByUser(
    userUuid: string,
    route: string,
    action: string,
    publicKey: string,
  ): Promise<boolean | InfrastructureError>;
}
