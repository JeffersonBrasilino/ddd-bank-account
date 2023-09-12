import { ActionHandlerInterface } from '@core/application';
import { Result } from '@core/application/result';
import { AuthTokenInterface } from '@module/user/domain/contracts/auth-token.interface';
import { RefreshAuthTokenRepositoryInterface } from '@module/user/domain/contracts/refresh-auth-token.repository.interface';
import { RefreshAuthTokenCommand } from './refresh-auth-token.command';
import { AbstractError } from '@core/domain/errors';

type response = Promise<Result<AbstractError<any> | object | boolean> | void>;
export class RefreshAuthTokenHandler
  implements ActionHandlerInterface<RefreshAuthTokenCommand | response>
{
  constructor(
    private repo: RefreshAuthTokenRepositoryInterface,
    private authToken: AuthTokenInterface,
  ) {}
  async execute(command: RefreshAuthTokenCommand): response {
    const checkTokenOrError = this.authToken.validateRefreshToken(
      command.refreshToken,
    );
    if (checkTokenOrError instanceof AbstractError) {
      return Result.failure(checkTokenOrError);
    }

    const existsOrError = await this.repo.getUserByRefreshToken(
      command.refreshToken,
    );
    if (existsOrError instanceof AbstractError) {
      return Result.failure(existsOrError);
    }

    const credencials = this.makeCredencials(checkTokenOrError);
    existsOrError.refreshDeviceAuthToken(
      checkTokenOrError.deviceId,
      credencials.authToken,
    );
    existsOrError.refreshDeviceRefreshToken(
      checkTokenOrError.deviceId,
      credencials.refreshToken,
    );

    this.repo.save(existsOrError);

    return Result.success(credencials);
  }

  private makeCredencials(userdata): Partial<any> {
    const data = structuredClone(userdata);
    delete data['exp'];
    delete data['iat'];

    const authData = { userId: data.userId, usersGroups: data.usersGroups };

    return {
      authToken: this.authToken.generateAuthToken(authData),
      refreshToken: this.authToken.generateRefreshToken(data),
    };
  }
}
