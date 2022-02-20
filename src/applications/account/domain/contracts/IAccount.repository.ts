import { Account } from '../entities/account';

export interface IAccountRepository {
  getAccountByUuId(uuid: string | number): Promise<Account>;
  getAccountByCpf(cpf: string): Promise<Account>;
  save(account: Account): Promise<Account>;
}
