import { UserSaveFirstLoginHandler as handler } from '@module/user/application/commands/user-save-first-login/user-save-first-login.handler';
import { UserSaveFirstLoginCommand } from '@module/user/application/commands/user-save-first-login/user-save-first-login.command';
import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';

@CommandHandler(UserSaveFirstLoginCommand)
export class UserSaveFirstLoginHandler extends handler {
  constructor(
    @Inject('UserSaveFirstLoginRepository') userRepo,
    @Inject('CryptPassword') passwordCrypt,
  ) {
    super(userRepo, passwordCrypt);
  }
}
