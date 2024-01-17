import { ActionHandlerInterface } from '@core/application';
import { Result } from '@core/application/result';
import { CryptPasswordInterface } from '@module/user/domain/contracts/crypt-password.interface';
import { RecoveryPasswordNewPasswordRepositoryInterface } from '@module/user/domain/contracts/recovery-password-new-password.repository.interface';
import { PasswordValueObject } from '@module/user/domain/password.value-object';
import { UserAggregateRoot } from '@module/user/domain/user.aggregate-root';
import { RecoveryPasswordNewPasswordCommand } from './recovery-password-new-password.command';
import { AbstractError } from '@core/domain/errors';

type response = Result<AbstractError<any> | boolean> | void;
export class RecoveryPasswordNewPasswordHandler
  implements
    ActionHandlerInterface<RecoveryPasswordNewPasswordCommand, response>
{
  constructor(
    private userRepo: RecoveryPasswordNewPasswordRepositoryInterface,
    private cryptPassword: CryptPasswordInterface,
  ) {}
  async execute(
    command: RecoveryPasswordNewPasswordCommand,
  ): Promise<response> {
    const resultOrError = (await this.userRepo.getUserCheckUserRecoveryPassword(
      command.userUuId,
      command.verificationCode,
    )) as UserAggregateRoot;

    if (resultOrError instanceof AbstractError) {
      return Result.failure(resultOrError);
    }
    const hashPassword = PasswordValueObject.create({
      value: command.newPassword,
    });

    if (hashPassword instanceof AbstractError) {
      return Result.failure(hashPassword);
    }
    hashPassword.crypt(this.cryptPassword);
    resultOrError.setPassword(hashPassword);
    resultOrError.setRecoveryCode(null);
    const resultRepo = await this.userRepo.save(resultOrError);

    if (resultRepo instanceof AbstractError) {
      return Result.failure(resultRepo);
    }

    return Result.success(resultRepo);
  }
}
