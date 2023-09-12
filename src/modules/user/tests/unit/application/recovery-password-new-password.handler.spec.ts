import { DomainValidationError } from '@core/domain/errors';
import {
  DataNotFoundError,
  InfrastructureError,
} from '@core/infrastructure/errors';
import { Result } from '@core/application/result';
import { RecoveryPasswordNewPasswordHandler } from '@module/user/application/commands/recovery-password-new-password/recovery-password-new-password.handler';
import { CryptPasswordInterface } from '@module/user/domain/contracts/crypt-password.interface';
import { RecoveryPasswordNewPasswordRepositoryInterface } from '@module/user/domain/contracts/recovery-password-new-password.repository.interface';
import { UserMapper } from '@module/user/mapper/user.mapper';
import { CryptPasswordMock } from '../../mocks/crypt-password.mock';
import { UserRepositoryMock } from '../../mocks/user.repository.mock';
import { UserStub } from '../../stubs/user.stub';

describe('RecoveryPasswordNewPasswordHandler', () => {
  let sut: RecoveryPasswordNewPasswordHandler;
  let repo: RecoveryPasswordNewPasswordRepositoryInterface;
  let cryptPassword: CryptPasswordInterface;
  beforeAll(() => {
    repo = new UserRepositoryMock(new UserMapper());
    cryptPassword = new CryptPasswordMock();
    sut = new RecoveryPasswordNewPasswordHandler(repo, cryptPassword);
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
    expect(response.getError()).toBeInstanceOf(DataNotFoundError);
  });

  it('should be error with password data incorrect', async () => {
    const response = (await sut.execute(
      UserStub.recoveryPasswordNewPasswordCommandStub(null),
    )) as Result<any>;
    expect(response).toBeInstanceOf(Result);
    expect(response.isFailure()).toBe(true);
    expect(response.getError()).toBeInstanceOf(DomainValidationError);
  });

  it('should be error with persist data falied', async () => {
    jest
      .spyOn(repo as any, 'save') //only private method access
      .mockReturnValue(new InfrastructureError('huehue'));
    const response = (await sut.execute(
      UserStub.recoveryPasswordNewPasswordCommandStub(),
    )) as Result<any>;
    expect(response).toBeInstanceOf(Result);
    expect(response.isFailure()).toBe(true);
    expect(response.getError()).toBeInstanceOf(InfrastructureError);
  });
});
