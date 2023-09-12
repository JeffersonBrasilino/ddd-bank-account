import { LoginRepositoryInterface } from '@module/user/domain/contracts/login.repository.interface';
import { RefreshAuthTokenRepositoryInterface } from '@module/user/domain/contracts/refresh-auth-token.repository.interface';
import { UserAggregateRoot } from '@module/user/domain/user.aggregate-root';
import { UserMapper } from '@module/user/mapper/user.mapper';
import { UserStub } from '../stubs/user.stub';
import { RecoveryPasswordNewPasswordRepositoryInterface } from '@module/user/domain/contracts/recovery-password-new-password.repository.interface';
import { RecoveryPasswordSendCodeRepositoryInterface } from '@module/user/domain/contracts/recovery-password-send-code.repository.interface';
import { AbstractError, ErrorFactory } from '@core/domain/errors';

export class UserRepositoryMock
  implements
    LoginRepositoryInterface,
    RefreshAuthTokenRepositoryInterface,
    RecoveryPasswordNewPasswordRepositoryInterface,
    RecoveryPasswordSendCodeRepositoryInterface
{
  //  RefreshAuthTokenRepositoryInterface
  constructor(private mapper: UserMapper) {}
  async findUserRecoveryPassword(
    username: string,
  ): Promise<UserAggregateRoot | AbstractError<any>> {
    if (username == 'username')
      return this.mapper.toDomain(UserStub.userAggregrateStub());

    if (username == 'not_found')
      return ErrorFactory.instance().create(
        'notFound',
        'usuario nao encontrado',
      );

    return ErrorFactory.instance().create(
      'InternalError',
      'error with username',
    );
  }
  async getUserCheckUserRecoveryPassword(
    uuid: string,
    verificationCode: string,
  ): Promise<UserAggregateRoot | AbstractError<any>> {
    if (
      uuid == '90120c3d-4a8d-4421-a3ac-5d03a2fb53d8' &&
      verificationCode == '1234'
    )
      return this.mapper.toDomain(UserStub.userAggregrateStub());

    return ErrorFactory.instance().create('notFound', 'usuario nao encontrado');
  }

  async getUserByUsername(
    username: string,
  ): Promise<UserAggregateRoot | AbstractError<any>> {
    if (username == 'exists') {
      return this.mapper.toDomain(UserStub.userAggregrateStub());
    }

    if (username == 'not_exists') {
      return ErrorFactory.instance().create(
        'notFound',
        'usuario nao encontrado',
      );
    }

    if (username == null) {
      return ErrorFactory.instance().create(
        'InternalError',
        'error during processing',
      );
    }
  }

  //TODO: add this function to base repo
  async save(user: UserAggregateRoot): Promise<boolean | AbstractError<any>> {
    return true;
  }

  async getUserByRefreshToken(
    refreshToken: string,
  ): Promise<UserAggregateRoot | AbstractError<any>> {
    if (refreshToken == 'refreshAuthToken') {
      return this.mapper.toDomain(UserStub.userAggregrateStub());
    }

    if (refreshToken == 'not_exists') {
      return ErrorFactory.instance().create(
        'notFound',
        'usuario nao encontrado',
      );
    }

    if (refreshToken == null) {
      return ErrorFactory.instance().create(
        'InternalError',
        'error during processing',
      );
    }
  }
}
