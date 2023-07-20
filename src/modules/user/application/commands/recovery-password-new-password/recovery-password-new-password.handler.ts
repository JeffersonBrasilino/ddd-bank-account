import { ActionHandlerInterface } from '@core/application';
import { DomainError } from '@core/domain/errors';
import {
  DataNotFoundError,
  InfrastructureError,
} from '@core/infrastructure/errors';
import { Result } from '@core/shared/result';
import { CryptPasswordInterface } from '@module/user/domain/contracts/crypt-password.interface';
import { UserRepositoryInterface } from '@module/user/domain/contracts/user-repository.interface';
import { PasswordValueObject } from '@module/user/domain/password.value-object';
import { UserAggregateRoot } from '@module/user/domain/user.aggregate-root';
import { RecoveryPasswordNewPasswordCommand } from './recovery-password-new-password.command';

type response = Result<any> | void;
export class RecoveryPasswordNewPasswordHandler
  implements
    ActionHandlerInterface<RecoveryPasswordNewPasswordCommand, response>
{
  constructor(
    private userRepo: UserRepositoryInterface,
    private cryptPassword: CryptPasswordInterface,
  ) {}
  async execute(
    command: RecoveryPasswordNewPasswordCommand,
  ): Promise<response> {
    const resultOrError = (await this.userRepo.getUserCheckUserRecoveryPassword(
      command.userUuId,
      command.verificationCode,
    )) as UserAggregateRoot;

    if (resultOrError instanceof DataNotFoundError) {
      return Result.failure<DataNotFoundError>(resultOrError);
    }
    const hashPassword = PasswordValueObject.create(command.newPassword);
    if (hashPassword instanceof DomainError) {
      return Result.failure<DomainError>(hashPassword);
    }
    hashPassword.crypt(this.cryptPassword);
    resultOrError.setPassword(hashPassword).setRecoveryCode(null);
    const resultRepo = await this.userRepo.save(resultOrError);

    if (resultRepo instanceof InfrastructureError) {
      return Result.failure(resultRepo);
    }

    return Result.success(resultRepo);
  }
}
