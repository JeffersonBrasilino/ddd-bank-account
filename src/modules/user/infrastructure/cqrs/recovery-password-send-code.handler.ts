import { RecoveryPasswordSendCodeCommand } from '@module/user/application/commands/recovery-password-send-code/recovery-password-send-code.command';
import { RecoveryPasswordSendCodeHandler as handler } from '@module/user/application/commands/recovery-password-send-code/recovery-password-send-code.handler';
import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';

@CommandHandler(RecoveryPasswordSendCodeCommand)
export class RecoveryPasswordSendCodeHandler extends handler {
  constructor(
    @Inject('UserRepositoryInterface') userRepo,
    @Inject('EmailClient') emailClient,
  ) {
    super(userRepo, emailClient);
  }
}
