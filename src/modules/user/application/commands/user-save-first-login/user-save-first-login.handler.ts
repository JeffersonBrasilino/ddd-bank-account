import { ActionHandlerInterface } from '@core/application';
import { Result } from '@core/application/result';
import { CryptPasswordInterface } from '@module/user/domain/contracts/crypt-password.interface';
import { UserSaveFirstLoginRepositoryInterface } from '@module/user/domain/contracts/user-save-first-login.repository.interface';
import { CpflValueObject } from '@module/user/domain/person/person-cpf.value-object';
import { UserAggregateRoot } from '@module/user/domain/user.aggregate-root';
import { UserBuilder } from '@module/user/domain/user.builder';
import { UserSaveFirstLoginCommand } from './user-save-first-login.command';
import { AbstractError } from '@core/domain/errors';

type response = Result<AbstractError<any> | boolean> | void | any;
export class UserSaveFirstLoginHandler
  implements ActionHandlerInterface<UserSaveFirstLoginCommand, response>
{
  constructor(
    private userRepo: UserSaveFirstLoginRepositoryInterface,
    private cryptPassword: CryptPasswordInterface,
  ) {}
  async execute(command: UserSaveFirstLoginCommand): Promise<response> {
    const cpfOrError = CpflValueObject.create(command.cpf);
    if (cpfOrError instanceof AbstractError) {
      return Result.failure(cpfOrError);
    }

    const userExists = await this.userRepo.exists(command.cpf);
    if (userExists instanceof AbstractError) {
      return Result.failure(userExists);
    }

    const AggregateOrError = this.makeAggregate(command);
    if (AggregateOrError instanceof AbstractError) {
      return Result.failure(AggregateOrError);
    }

    const saveOrError = await this.userRepo.save(AggregateOrError);
    if (saveOrError instanceof AbstractError) {
      return Result.failure(saveOrError);
    }
    return Result.success(saveOrError);
  }

  private makeAggregate(rawData) {
    const build = new UserBuilder()
      .withPassword(rawData.password)
      .withUsername(rawData.cpf)
      .withUserGroups([{ id: 1, main: true }])
      .withPerson({
        name: rawData.name,
        cpf: rawData.cpf,
        birthDate: new Date(rawData.birthDate),
        contacts: [
          { description: rawData.email, main: true, contactType: { id: 1 } },
          { description: rawData.phone, main: true, contactType: { id: 2 } },
        ],
      })
      .build();

    if (build instanceof UserAggregateRoot)
      build.getPassword().crypt(this.cryptPassword);
    return build;
  }
}
