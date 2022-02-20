import { IAccountRepository } from '@applications/account/domain/contracts/IAccount.repository';
import { MovementMapper } from '@applications/account/mapper/movement.mapper';
export class AccountBalanceUseCase {
  constructor(private _repo: IAccountRepository) {}
  async execute(accountId: string | number) {
    try {
      if (!accountId) throw Error('account uuid nao pode ser vazio.');

      const account = await this._repo.getAccountByUuId(accountId);
      if (!account) throw Error('NOT_FOUND');
      return MovementMapper.toDto(account.movement);
    } catch (e) {
      throw e;
    }
  }
}
