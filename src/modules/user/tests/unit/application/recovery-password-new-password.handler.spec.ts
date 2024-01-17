import { Result } from '@core/application/result';
import { NotFoundError } from '@core/domain/errors/not-found.error';

import { ErrorFactory, ValidationError } from '@core/domain/errors';
import { DependencyError } from '@core/domain/errors/dependency.error';
import { RecoveryPasswordNewPasswordHandler } from '@module/user/application/commands/recovery-password-new-password/recovery-password-new-password.handler';
import { CryptPasswordMock } from '../../mocks/crypt-password.mock';
import { userRepo } from '../../mocks/user.repository.mock';
import { UserStub } from '../../stubs/user.stub';

describe('RecoveryPasswordNewPasswordHandler', () => {
  let sut: RecoveryPasswordNewPasswordHandler;
  beforeAll(() => {
    sut = new RecoveryPasswordNewPasswordHandler(userRepo, CryptPasswordMock);
  });
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should be save new password successfully', async () => {
    const response = (await sut.execute(
      UserStub.recoveryPasswordNewPasswordCommandStub(),
    )) as Result<any>;
    expect(response).toBeInstanceOf(Result);
    expect(response.isSuccess()).toBe(true);
    expect(response.getValue()).toEqual(true);
  });

  it('should be error with not exists user', async () => {
    const response = (await sut.execute(
      UserStub.recoveryPasswordNewPasswordCommandStub('new password', '12345'),
    )) as Result<any>;
    expect(response).toBeInstanceOf(Result);
    expect(response.isFailure()).toBe(true);
    expect(response.getError()).toBeInstanceOf(NotFoundError);
  });

  it('should be error with new password password null', async () => {
    const response = (await sut.execute(
      UserStub.recoveryPasswordNewPasswordCommandStub(null),
    )) as Result<any>;
    expect(response).toBeInstanceOf(Result);
    expect(response.isFailure()).toBe(true);
    expect(response.getError()).toBeInstanceOf(ValidationError);
  });

  it('should be error with persist data falied', async () => {
    jest
      .spyOn(userRepo as any, 'save') //only private method access
      .mockReturnValue(ErrorFactory.create('Dependency'));
    const response = (await sut.execute(
      UserStub.recoveryPasswordNewPasswordCommandStub(),
    )) as Result<any>;
    expect(response).toBeInstanceOf(Result);
    expect(response.isFailure()).toBe(true);
    expect(response.getError()).toBeInstanceOf(DependencyError);
  });
});
