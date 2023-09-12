import { RefreshAuthTokenCommand } from '@module/user/application/commands/refresh-auth-token/refresh-auth-token.command';
import { RefreshAuthTokenHandler as handler } from '@module/user/application/commands/refresh-auth-token/refresh-auth-token.handler';
import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';

@CommandHandler(RefreshAuthTokenCommand)
export class RefreshAuthTokenHandler extends handler {
  constructor(
    @Inject('RefreshAuthTokenRepositoryInterface') loginRepo,
    @Inject('AuthToken') jwtService,
  ) {
    super(loginRepo, jwtService);
  }
}
