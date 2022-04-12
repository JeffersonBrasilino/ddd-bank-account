import { Account } from '@applications/account/domain/entities/account';
import { CpfValueObject } from '@applications/account/domain/value-objects/cpf.value-object';
import { AccountMapper } from '@applications/account/mapper/account.mapper';
import { CreateAccountDto } from './create-account.dto';
import { Movement } from '@applications/account/domain/entities/movement';
import { IAccountRepository } from '@applications/account/domain/contracts/IAccount.repository';
import { Result } from '@core/shared/result';
import {
  BadRequesErrortUseCase,
  InternalErrorUseCase,
} from '@core/application/use-case.errors';
import { IUseCase } from '@core/application/Iuse-case';

type Response =
  | BadRequesErrortUseCase<CreateAccountUseCase>
  | Result<any>
  | Result<void>;
export class CreateAccountUseCase
  implements IUseCase<CreateAccountDto, Response>
{
  constructor(private _repo: IAccountRepository) {}
  async execute(props: CreateAccountDto): Promise<Response> {
    try {
      //cria o cpf e everifica se e valido
      const cpfOrError: Result<CpfValueObject> = CpfValueObject.create(
        props.cpf,
      );
      if (!cpfOrError.isSuccess)
        return new BadRequesErrortUseCase<CpfValueObject>(
          cpfOrError.getError(),
        );

      //cria as movimentacoes e verifica se todas elas sao validas
      const movementsOrError: Result<Movement>[] = props.movement
        ? props.movement.map((v) => Movement.create(v))
        : [];
      const movementsOrErrorResult = Result.combine(movementsOrError);
      if (!movementsOrErrorResult.isSuccess) {
        return new BadRequesErrortUseCase(movementsOrErrorResult.getError());
      }

      //cira a conta e verifica se a conta e valida
      const accountOrError: Result<Account> = Account.create({
        cpf: cpfOrError.getValue(),
        name: props.name,
        movement: movementsOrError.map((v) => v.getValue()),
      });
      if (!accountOrError.isSuccess)
        return new BadRequesErrortUseCase<Account>(accountOrError.getError());

      this._repo.save(accountOrError.getValue());
      return Result.ok<CreateAccountUseCase>(
        AccountMapper.toDto(accountOrError.getValue()),
      );
    } catch (e) {
      return new InternalErrorUseCase<CreateAccountUseCase>(e);
    }
  }
}
