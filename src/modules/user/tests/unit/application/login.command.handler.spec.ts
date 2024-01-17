import { Result } from '@core/application/result';
import { ErrorFactory } from '@core/domain/errors';
import { InvalidDataError } from '@core/domain/errors/invalid-data.error';
import { NotFoundError } from '@core/domain/errors/not-found.error';
import { LoginCommandHandler } from '@module/user/application/commands/login/login.command.handler';
import { AuthTokenInterface } from '@module/user/domain/contracts/auth-token.interface';
import { CryptPasswordInterface } from '@module/user/domain/contracts/crypt-password.interface';
import { UserAggregateRoot } from '@module/user/domain/user.aggregate-root';
import { AuthTokenMock } from '../../mocks/auth-token.mock';
import { CryptPasswordMock } from '../../mocks/crypt-password.mock';
import { UserStub } from '../../stubs/user.stub';
import { userRepo } from '../../mocks/user.repository.mock';

describe('LoginCommandHandler', () => {
  let sut: LoginCommandHandler;
  beforeAll(() => {
    sut = new LoginCommandHandler(userRepo, CryptPasswordMock, AuthTokenMock);
  });

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should be login successfully', async () => {
    const response = await sut.execute(
      UserStub.loginCommandStub('dummy', 'correctlyPass', 'exists'),
    );
    expect(userRepo.getUserByUsername).toHaveBeenCalledTimes(1);
    expect(userRepo.getUserByUsername).toHaveBeenCalledWith('exists');
    expect(userRepo.getUserByUsername).toHaveReturnedTimes(1);
    expect(userRepo.getUserByUsername('exists')).resolves.toBeInstanceOf(
      UserAggregateRoot,
    );
    expect(response).toBeInstanceOf(Result);
    expect((response as Result<any>).isSuccess()).toBe(true);
    expect(Object.keys((response as Result<any>).getValue())).toEqual(
      expect.arrayContaining(['authToken', 'refreshToken']),
    );
  });

  it('should login error with wrong password', async () => {
    const response = await sut.execute(
      UserStub.loginCommandStub('dummy', 'wrongPassword', 'exists'),
    );
    expect(userRepo.getUserByUsername).toHaveBeenCalledTimes(1);
    expect(userRepo.getUserByUsername).toHaveBeenCalledWith('exists');
    expect(userRepo.getUserByUsername).toHaveReturnedTimes(1);
    expect(userRepo.getUserByUsername('exists')).resolves.toBeInstanceOf(
      UserAggregateRoot,
    );
    jest.spyOn(sut as any, 'checkPassword').mockReturnValue(false);
    expect(response).toBeInstanceOf(Result);
    expect((response as Result<any>).isFailure()).toBe(true);
    expect(response.getError()).toBeInstanceOf(InvalidDataError);
    expect((response as Result<any>).getError()).toStrictEqual(
      expect.objectContaining({ errorOrMessage: 'senha incorreta' }),
    );
  });

  it('should be error with make new device error', async () => {
    jest
      .spyOn(sut as any, 'makeDevice') //only private method access
      .mockReturnValue(ErrorFactory.create('InvalidData', 'huehue'));
    const response = (await sut.execute(
      UserStub.loginCommandStub(
        '4567',
        'correctlyPass',
        'exists',
        'new device',
      ),
    )) as Result<any>;
    expect(response).toBeInstanceOf(Result);
    expect(response.getError()).toBeInstanceOf(InvalidDataError);
  });

  it('should be error with user not found', async () => {
    const response = (await sut.execute(
      UserStub.loginCommandStub('dummy', 'correctlyPass', 'not_exists'),
    )) as Result<any>;
    expect(response).toBeInstanceOf(Result);
    expect(response.isFailure()).toBe(true);
    expect(response.getError()).toBeInstanceOf(NotFoundError);
  });
});
