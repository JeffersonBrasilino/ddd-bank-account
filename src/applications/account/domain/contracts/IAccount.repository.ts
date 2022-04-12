import { Account } from '../entities/account';
import { Movement } from '@applications/account/domain/entities/movement';

export interface IAccountRepository {
  getAccountByUuId(uuid: string | number): Promise<Account | null>;
  getAccountByCpf(cpf: string): Promise<Account>;
  save(account: Account): Promise<Account>;

  getMovementByAccountUuId(accoutUuId: string | number): Promise<Movement[]>;
}
