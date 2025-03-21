import { AbstractError } from '@core/domain/errors';
import { UserAggregateRoot } from '../user.aggregate-root';

export interface LoginRepositoryInterface {
  getUserByUsername(
    username: string,
  ): Promise<UserAggregateRoot | AbstractError<any>>;
  save(user: UserAggregateRoot): Promise<boolean | AbstractError<any>>;
}
