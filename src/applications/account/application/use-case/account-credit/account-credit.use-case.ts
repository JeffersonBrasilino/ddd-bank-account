import { AccountCreditDto } from './account-credit.dto';
import { IAccountRepository } from '@applications/account/domain/contracts/IAccount.repository';
import { AccountMapper } from '@applications/account/mapper/account.mapper';

export class AccountCreditUseCase {
  constructor(private _repo: IAccountRepository) {}
  async execute(props: AccountCreditDto): Promise<any> {
    try {
      const accountData = await this._repo.getAccountByUuId(props.accountId);
      if (!accountData) throw Error('NOT_FOUND');

      accountData.movement.credit(props.value);
      await this._repo.save(accountData);
      return AccountMapper.toDto(accountData);
    } catch (e) {
      throw e;
    }
  }
}
