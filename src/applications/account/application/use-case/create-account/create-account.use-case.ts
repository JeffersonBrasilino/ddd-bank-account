import { Account } from '@applications/account/domain/entities/account';
import { CpfValueObject } from '@applications/account/domain/value-objects/cpf.value-object';
import { AccountMapper } from '@applications/account/mapper/account.mapper';
import { CreateAccountDto } from './create-account.dto';
import { Movement } from '@applications/account/domain/entities/movement';
import { IAccountRepository } from '@applications/account/domain/contracts/IAccount.repository';
export class CreateAccountUseCase {
  constructor(private _repo: IAccountRepository) {}
  async execute(props: CreateAccountDto) {
    try {
      const cpf: CpfValueObject = CpfValueObject.create(props.cpf);
      if (await this._repo.getAccountByCpf(cpf.value)) throw Error('CONFLICT');

      const movement = props.movement ? Movement.create(props.movement) : null;
      const account = Account.create({
        cpf: cpf,
        name: props.name,
        movement: movement,
      });
      this._repo.save(account);
      return AccountMapper.toDto(account);
    } catch (e) {
      throw e;
    }
  }
}
