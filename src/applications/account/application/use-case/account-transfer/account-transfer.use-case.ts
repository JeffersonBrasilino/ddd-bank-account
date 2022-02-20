import { AccountTransferDto } from './account-transfer.dto';
import { IAccountRepository } from '@applications/account/domain/contracts/IAccount.repository';
export class AccountTransferUseCase {
  constructor(private repo: IAccountRepository) {}
  async execute(props: AccountTransferDto) {
    try {
      //dados da conta de destino
      const accountDestiny = await this.repo.getAccountByUuId(
        props.accountDestinyId,
      );
      if (!accountDestiny) throw Error('conta de destino nao existe');

      //dados da conta de origem
      const accountOrigin = await this.repo.getAccountByUuId(
        props.accountOriginId,
      );
      if (!accountOrigin) throw Error('conta de origem nao existe');

      //debita o valor da conta de origem
      accountOrigin.movement.debit(props.value);
      //credita na conta de destino
      accountDestiny.movement.credit(props.value);
      //salva o desconto da origem no banco
      await this.repo.save(accountOrigin);

      //salva o credito da origem no banco
      await this.repo.save(accountDestiny);

      return true;
    } catch (e) {
      throw e;
    }
  }
}
