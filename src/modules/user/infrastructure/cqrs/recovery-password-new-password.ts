import { RecoveryPasswordNewPasswordCommand } from '@module/user/application/commands/recovery-password-new-password/recovery-password-new-password.command';
import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { RecoveryPasswordNewPasswordHandler as handler } from '@module/user/application/commands/recovery-password-new-password/recovery-password-new-password.handler';

@CommandHandler(RecoveryPasswordNewPasswordCommand)
export class RecoveryPasswordNewPasswordHandler extends handler {
  constructor(
    @Inject('UserRepositoryInterface') userRepo,
    @Inject('CryptPassword') passwordCrypt,
  ) {
    super(userRepo, passwordCrypt);
  }
}
