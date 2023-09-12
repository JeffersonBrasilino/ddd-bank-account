import { UserExistsQuery } from '@module/user/application/queries/user-exists/user-exists.query';
import { UserExistsQueryHandler as handler } from '@module/user/application/queries/user-exists/user-exists.query.handler';
import { UserMapper } from '@module/user/mapper/user.mapper';
import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';

@CommandHandler(UserExistsQuery)
export class UserExistsQueryHandler extends handler {
  constructor(
    @Inject('UserExistsGateway') userExistsGateway,
    @Inject('UserExistsRepository') userExistsRepo,
    @Inject(UserMapper) mapper: UserMapper,
  ) {
    super(userExistsGateway, userExistsRepo, mapper);
  }
}
