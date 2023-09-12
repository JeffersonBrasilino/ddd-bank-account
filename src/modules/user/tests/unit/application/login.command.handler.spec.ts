import { LoginCommandHandler } from '@module/user/application/commands/login/login.command.handler';
import { AuthTokenInterface } from '@module/user/domain/contracts/auth-token.interface';
import { CryptPasswordInterface } from '@module/user/domain/contracts/crypt-password.interface';
import { LoginRepositoryInterface } from '@module/user/domain/contracts/login.repository.interface';
import { UserMapper } from '@module/user/mapper/user.mapper';
import { UserRepositoryMock } from '../../mocks/user.repository.mock';
import { UserStub } from '../../stubs/user.stub';
import { CryptPasswordMock } from '../../mocks/crypt-password.mock';
import { AuthTokenMock } from '../../mocks/auth-token.mock';
import { Result } from '@core/application/result';
import { InvalidDataError } from '@core/application/errors/invalid-data.error';
import { DataNotFoundError } from '@core/infrastructure/errors';
import { DomainError } from '@core/domain/errors';
import { UserAggregateRoot } from '@module/user/domain/user.aggregate-root';

describe('LoginCommandHandler', () => {
  let sut: LoginCommandHandler;
  let repo: LoginRepositoryInterface;
  let passwordCrypt: CryptPasswordInterface;
  let authToken: AuthTokenInterface;
  beforeAll(() => {
    repo = new UserRepositoryMock(new UserMapper());
    passwordCrypt = new CryptPasswordMock();
    authToken = new AuthTokenMock();
    sut = new LoginCommandHandler(repo, passwordCrypt, authToken);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should be login successfully', async () => {
    const response = await sut.execute(
      UserStub.loginCommandStub('dummy', 'correctlyPass', 'exists'),
    );
    expect(response).toBeInstanceOf(Result);
    expect((response as Result<any>).isSuccess()).toBe(true);
    expect(Object.keys((response as Result<any>).getValue())).toEqual(
      expect.arrayContaining(['authToken', 'refreshToken']),
    );
  });

  it('should be add new device error', async () => {
    jest
      .spyOn(sut as any, 'makeDevice') //only private method access
      .mockReturnValue(new DomainError('huehue'));
    const response = (await sut.execute(
      UserStub.loginCommandStub(
        '4567',
        'correctlyPass',
        'exists',
        'new device',
      ),
    )) as Result<any>;
    expect(response).toBeInstanceOf(Result);
    expect(response.getError()).toBeInstanceOf(DomainError);
  });

  it('should be user not found error', async () => {
    const response = (await sut.execute(
      UserStub.loginCommandStub('dummy', 'correctlyPass', 'not_exists'),
    )) as Result<any>;
    expect(response).toBeInstanceOf(Result);
    expect(response.isFailure()).toBe(true);
    expect(response.getError()).toBeInstanceOf(DataNotFoundError);
  });

  it('should be invalid password error ', async () => {
    const response = (await sut.execute(
      UserStub.loginCommandStub('dummy', 'incorrectlyPass', 'exists'),
    )) as Result<any>;
    expect(response).toBeInstanceOf(Result);
    expect(response.isFailure()).toBe(true);
    expect(response.getError()).toBeInstanceOf(InvalidDataError);
  });
});
