import { AbstractError } from '@core/domain/errors';
import { UserAggregateRoot } from '../user.aggregate-root';

export interface RecoveryPasswordNewPasswordRepositoryInterface {
  getUserCheckUserRecoveryPassword(
    uuid: string,
    verificationCode: string,
  ): Promise<UserAggregateRoot | AbstractError<any>>;

  save(user: UserAggregateRoot): Promise<boolean | AbstractError<any>>;
}
