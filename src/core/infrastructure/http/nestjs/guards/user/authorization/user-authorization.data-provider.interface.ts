import { AbstractError } from '@core/domain/errors';

export interface UserAuthorizationDataProviderInterface {
  checkPermissionRouteByUser(
    userUuid: string,
    route: string,
    action: string,
    publicKey: string,
  ): Promise<boolean | AbstractError<any>>;
}
