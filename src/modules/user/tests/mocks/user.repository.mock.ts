import { AbstractError, ErrorFactory } from '@core/domain/errors';
import { LoginRepositoryInterface } from '@module/user/domain/contracts/login.repository.interface';
import { RecoveryPasswordNewPasswordRepositoryInterface } from '@module/user/domain/contracts/recovery-password-new-password.repository.interface';
import { RecoveryPasswordSendCodeRepositoryInterface } from '@module/user/domain/contracts/recovery-password-send-code.repository.interface';
import { RefreshAuthTokenRepositoryInterface } from '@module/user/domain/contracts/refresh-auth-token.repository.interface';
import { UserSaveFirstLoginRepositoryInterface } from '@module/user/domain/contracts/user-save-first-login.repository.interface';
import { UserAggregateRoot } from '@module/user/domain/user.aggregate-root';
import { UserMapper } from '@module/user/mapper/user.mapper';
import { UserStub } from '../stubs/user.stub';

const mapper = new UserMapper();
export const userRepo: jest.Mocked<
  LoginRepositoryInterface &
    RefreshAuthTokenRepositoryInterface &
    RecoveryPasswordNewPasswordRepositoryInterface &
    RecoveryPasswordSendCodeRepositoryInterface &
    UserSaveFirstLoginRepositoryInterface
> = {
  findUserRecoveryPassword: jest.fn(async (username: string) => {
    if (username == 'username')
      return mapper.toDomain(UserStub.userAggregrateStub());

    if (username == 'not_found')
      return ErrorFactory.create('notFound', 'usuario nao encontrado');

    if (username == 'not_found_email') {
      let userData = UserStub.userAggregrateStub();
      userData.person.contacts[0].main = 0;
      return mapper.toDomain(userData);
    }

    return ErrorFactory.create('Internal', 'error with username');
  }),
  getUserCheckUserRecoveryPassword: jest.fn(
    async (uuid: string, verificationCode: string) => {
      if (
        uuid == '90120c3d-4a8d-4421-a3ac-5d03a2fb53d8' &&
        verificationCode == '1234'
      )
        return mapper.toDomain(UserStub.userAggregrateStub());

      return ErrorFactory.create('notFound', 'usuario nao encontrado');
    },
  ),
  getUserByUsername: jest.fn(async username => {
    if (username == 'exists') {
      return mapper.toDomain(UserStub.userAggregrateStub());
    }

    if (username == 'not_exists') {
      return ErrorFactory.create('notFound', 'usuario nao encontrado');
    }

    if (username == null) {
      return ErrorFactory.create('Internal', 'error during processing');
    }
  }),
  getUserByRefreshToken: jest.fn(async (refreshToken: string) => {
    if (refreshToken == 'refreshAuthToken') {
      return mapper.toDomain(UserStub.userAggregrateStub());
    }

    if (refreshToken == 'not_exists') {
      return ErrorFactory.create('notFound', 'usuario nao encontrado');
    }

    if (refreshToken == null) {
      return ErrorFactory.create('Internal', 'error during processing');
    }
  }),
  save: jest.fn(async (cpf: string) => {
    return true;
  }) as any,
  exists: jest.fn(async (cpf: string) => {
    if (cpf == '54273132060') {
      return ErrorFactory.create('AlreadyExists');
    }
    return true;
  }),
};
