import { IAccountRepository } from '@applications/account/domain/contracts/IAccount.repository';
import { MovementMapper } from '@applications/account/mapper/movement.mapper';
import {
  BadRequesErrortUseCase,
  NotFoundErrorUseCase,
} from '@core/application/use-case.errors';

import { Movement } from '@applications/account/domain/entities/movement';
import { Result } from '@core/shared/result';
import { IUseCase } from '@core/application/Iuse-case';
type Response =
  | BadRequesErrortUseCase<AccountBalanceUseCase>
  | NotFoundErrorUseCase<AccountBalanceUseCase>
  | Result<Movement[]>
  | Result<void>;
export class AccountBalanceUseCase
  implements IUseCase<string | number, Response>
{
  constructor(private _repo: IAccountRepository) {}
  async execute(accountId: string | number): Promise<Response> {
    try {
      if (!accountId)
        return new BadRequesErrortUseCase<AccountBalanceUseCase>(
          'account uuid nao pode ser vazio.',
        );

      const accountOrError = await this._repo.getAccountByUuId(accountId);
      if (!accountOrError)
        return new NotFoundErrorUseCase<AccountBalanceUseCase>(
          'conta nao encontrada.',
        );
      return Result.ok<Movement[]>(
        accountOrError.movement.map((v) => MovementMapper.toDto(v)),
      );
    } catch (e) {
      throw e;
    }
  }
}
