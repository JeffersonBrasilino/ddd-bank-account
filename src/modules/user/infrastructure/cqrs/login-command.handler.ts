import { LoginCommand } from '@module/user/application/commands/login/login.command';
import { LoginCommandHandler as handler } from '@module/user/application/commands/login/login.command.handler';
import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';

@CommandHandler(LoginCommand)
export class LoginCommandHandler extends handler {
  constructor(
    @Inject('LoginRepo') loginRepo,
    @Inject('CryptPassword') passwordCrypt,
    @Inject('AuthToken') jwtService,
  ) {
    super(loginRepo, passwordCrypt, jwtService);
  }
}
