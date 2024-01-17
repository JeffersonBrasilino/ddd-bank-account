import { ActionHandlerInterface } from '@core/application';
import { Result } from '@core/application/result';
import { UserExistsGatewayInterface } from '@module/user/domain/contracts/user-exists.gateway.interface';
import { UserExistsRepositoryInterface } from '@module/user/domain/contracts/user-exists.repository.interface';
import { UserAggregateRoot } from '@module/user/domain/user.aggregate-root';
import { UserMapper } from '@module/user/mapper/user.mapper';
import { UserExistsQuery } from './user-exists.query';
import { AbstractError } from '@core/domain/errors';

type response = Result<AbstractError<any> | any>;
export class UserExistsQueryHandler
  implements ActionHandlerInterface<any, response>
{
  constructor(
    private userGateway: UserExistsGatewayInterface,
    private userRepo: UserExistsRepositoryInterface,
    private userMpaper: UserMapper,
  ) {}
  async execute(action: UserExistsQuery): Promise<response> {
    const personRepo = await this.userRepo.exists(action.cpf);
    if (personRepo instanceof AbstractError) {
      return Result.success({ firstLogin: false });
    }

    const personGateway = await this.userGateway.getByCpf(action.cpf);
    if (personGateway instanceof UserAggregateRoot) {
      return Result.success({
        firstLogin: true,
        ...this.userMpaper.toDto(personGateway, 'userEistsResponse'),
      });
    }
    return Result.failure(personGateway);
  }
}
