import { InfrastructureError } from '@core/infrastructure/errors';
import { UserAggregateRoot } from '../user.aggregate-root';

export interface UserRepositoryInterface {
  getUserLogin(username: string);

  saveRecoveryPasswordCode(
    entity: UserAggregateRoot,
  ): Promise<boolean | InfrastructureError>;

  findUserRecoveryPassword(
    username: string,
  ): Promise<UserAggregateRoot | InfrastructureError>;

  getUserCheckUserRecoveryPassword(
    uuid: string,
    verificationCode: string,
  ): Promise<UserAggregateRoot | InfrastructureError>;

  save(user: UserAggregateRoot): Promise<boolean | InfrastructureError>;
}
