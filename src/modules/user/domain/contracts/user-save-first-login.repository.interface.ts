import { AbstractError } from '@core/domain/errors';
import { UserAggregateRoot } from '../user.aggregate-root';

export interface UserSaveFirstLoginRepositoryInterface {
  exists(cpf: string): Promise<boolean | AbstractError<any>>;
  save(domainData: UserAggregateRoot): Promise<boolean | AbstractError<any>>;
}
