import { DataNotFoundError } from '@core/infrastructure/errors';
import { InvalidDataError } from '@core/infrastructure/errors/invalid-data.error';
import { Result } from '@core/application/result';
import { RefreshAuthTokenHandler } from '@module/user/application/commands/refresh-auth-token/refresh-auth-token.handler';
import { AuthTokenInterface } from '@module/user/domain/contracts/auth-token.interface';
import { RefreshAuthTokenRepositoryInterface } from '@module/user/domain/contracts/refresh-auth-token.repository.interface';
import { UserMapper } from '@module/user/mapper/user.mapper';
import { AuthTokenMock } from '../../mocks/auth-token.mock';
import { UserRepositoryMock } from '../../mocks/user.repository.mock';
import { UserStub } from '../../stubs/user.stub';

describe('RefreshAuthTokenHandler', () => {
  let sut: RefreshAuthTokenHandler;
  let repo: RefreshAuthTokenRepositoryInterface;
  let authToken: AuthTokenInterface;
  beforeAll(() => {
    repo = new UserRepositoryMock(new UserMapper());
    authToken = new AuthTokenMock();
    sut = new RefreshAuthTokenHandler(repo, authToken);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should be refresh auth token successfully', async () => {
    const response = await sut.execute(UserStub.refreshAuthTokenCommandStub());
    expect(response).toBeInstanceOf(Result);
    expect((response as Result<any>).isSuccess()).toBe(true);
    expect(Object.keys((response as Result<any>).getValue())).toEqual(
      expect.arrayContaining(['authToken', 'refreshToken']),
    );
  });

  it('should be error with invalid refresh token', async () => {
    const response = (await sut.execute(
      UserStub.refreshAuthTokenCommandStub('invalid'),
    )) as Result<any>;
    expect(response).toBeInstanceOf(Result);
    expect(response.getError()).toBeInstanceOf(InvalidDataError);
  });

  it('should be error with not exists refresh token', async () => {
    const response = (await sut.execute(
      UserStub.refreshAuthTokenCommandStub('not_exists'),
    )) as Result<any>;

    expect(response).toBeInstanceOf(Result);
    expect(response.isFailure()).toBe(true);
    expect(response.getError()).toBeInstanceOf(DataNotFoundError);
  });
});
