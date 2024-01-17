import { Result } from '@core/application/result';
import { ErrorFactory, ValidationError } from '@core/domain/errors';
import { AlreadyExistsError } from '@core/domain/errors/already-exists.error';
import { DependencyError } from '@core/domain/errors/dependency.error';
import { InvalidDataError } from '@core/domain/errors/invalid-data.error';
import { UserSaveFirstLoginHandler } from '@module/user/application/commands/user-save-first-login/user-save-first-login.handler';
import { CryptPasswordMock } from '../../mocks/crypt-password.mock';
import { userRepo } from '../../mocks/user.repository.mock';
import { UserStub } from '../../stubs/user.stub';

describe('UserSaveFirstLoginHandler', () => {
  let sut: UserSaveFirstLoginHandler;
  beforeAll(() => {
    sut = new UserSaveFirstLoginHandler(userRepo, CryptPasswordMock);
  });
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should be save successfully', async () => {
    const response = await sut.execute(UserStub.saveFirstLoginCommandStub());
    expect(response).toBeInstanceOf(Result);
    expect((response as Result<any>).isSuccess()).toBe(true);
    expect((response as Result<any>).getValue()).toBe(true);
  });

  it('should be error when save with invalid cpf', async () => {
    const response = await sut.execute(
      UserStub.saveFirstLoginCommandStub('83390395805'),
    );
    expect(response).toBeInstanceOf(Result);
    expect((response as Result<any>).isSuccess()).toBe(false);
    expect((response as Result<any>).getError()).toBeInstanceOf(
      ValidationError,
    );
  });

  it('should be error when save with exists cpf', async () => {
    const response = await sut.execute(
      UserStub.saveFirstLoginCommandStub('54273132060'),
    );
    expect(response).toBeInstanceOf(Result);
    expect((response as Result<any>).isSuccess()).toBe(false);
    expect((response as Result<any>).getError()).toBeInstanceOf(
      AlreadyExistsError,
    );
  });

  it('should be error when save error', async () => {
    jest
      .spyOn(userRepo as any, 'save') //only private method access
      .mockReturnValue(ErrorFactory.create('Dependency'));

    const response = await sut.execute(
      UserStub.saveFirstLoginCommandStub('83390395806'),
    );
    expect(response).toBeInstanceOf(Result);
    expect((response as Result<any>).isSuccess()).toBe(false);
    expect((response as Result<any>).getError()).toBeInstanceOf(
      DependencyError,
    );
  });
  it('should be error when make aggregate error', async () => {
    jest
      .spyOn(sut as any, 'makeAggregate') //only private method access
      .mockReturnValue(ErrorFactory.create('InvalidData'));

    const response = await sut.execute(
      UserStub.saveFirstLoginCommandStub('83390395806'),
    );
    expect(response).toBeInstanceOf(Result);
    expect((response as Result<any>).isSuccess()).toBe(false);
    expect((response as Result<any>).getError()).toBeInstanceOf(
      InvalidDataError,
    );
  });
});
