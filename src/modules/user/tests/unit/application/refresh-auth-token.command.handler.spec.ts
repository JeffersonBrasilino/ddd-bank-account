import { Result } from '@core/application/result';
import { InvalidDataError } from '@core/domain/errors/invalid-data.error';
import { NotFoundError } from '@core/domain/errors/not-found.error';
import { RefreshAuthTokenHandler } from '@module/user/application/commands/refresh-auth-token/refresh-auth-token.handler';
import { AuthTokenMock } from '../../mocks/auth-token.mock';
import { userRepo } from '../../mocks/user.repository.mock';
import { UserStub } from '../../stubs/user.stub';

describe('RefreshAuthTokenHandler', () => {
  let sut: RefreshAuthTokenHandler;
  beforeAll(() => {
    sut = new RefreshAuthTokenHandler(userRepo, AuthTokenMock);
  });
  beforeEach(() => {
    jest.restoreAllMocks();
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
    expect(response.getError()).toBeInstanceOf(NotFoundError);
  });
});
