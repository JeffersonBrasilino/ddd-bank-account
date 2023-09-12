import { AbstractError } from '@core/domain/errors';
import { UserAggregateRoot } from '../user.aggregate-root';

export interface LoginRepositoryInterface {
  getUserByUsername(username: string);
  save(user: UserAggregateRoot): Promise<boolean | AbstractError<any>>;
}
