import { DomainValidationError } from '@core/domain/errors';
import {
  DataNotFoundError,
  DependencyError,
  InfrastructureError,
} from '@core/infrastructure/errors';
import { Result } from '@core/application/result';
import { RecoveryPasswordNewPasswordHandler } from '@module/user/application/commands/recovery-password-new-password/recovery-password-new-password.handler';
import { RecoveryPasswordSendCodeHandler } from '@module/user/application/commands/recovery-password-send-code/recovery-password-send-code.handler';
import { CryptPasswordInterface } from '@module/user/domain/contracts/crypt-password.interface';
import { RecoveryPasswordNewPasswordRepositoryInterface } from '@module/user/domain/contracts/recovery-password-new-password.repository.interface';
import { UserMapper } from '@module/user/mapper/user.mapper';
import { CryptPasswordMock } from '../../mocks/crypt-password.mock';
import { UserRepositoryMock } from '../../mocks/user.repository.mock';
import { UserStub } from '../../stubs/user.stub';
import { RecoveryPasswordSendCodeRepositoryInterface } from '@module/user/domain/contracts/recovery-password-send-code.repository.interface';
import { EmailClientInterface } from '@core/domain/contracts/email-client.interface';
import { SendEmailMock } from '../../mocks/send-email.mock';

describe('RecoveryPasswordSendCodeHandler', () => {
  let sut: RecoveryPasswordSendCodeHandler;
  let repo: RecoveryPasswordSendCodeRepositoryInterface;
  let email: EmailClientInterface;
  beforeAll(() => {
    repo = new UserRepositoryMock(new UserMapper());
    email = new SendEmailMock();
    sut = new RecoveryPasswordSendCodeHandler(repo, email);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should be send recovery password successfully', async () => {
    const response = (await sut.execute(
      UserStub.recoveryPasswordSendCodeCommandStub(),
    )) as Result<any>;
    expect(response).toBeInstanceOf(Result);
    expect(response.isSuccess()).toBe(true);
    expect(Object.keys((response as Result<any>).getValue())).toEqual(
      expect.arrayContaining(['email', 'userUuid']),
    );
  });

  it('should be error recovery password with not found username', async () => {
    const response = (await sut.execute(
      UserStub.recoveryPasswordSendCodeCommandStub('not_found'),
    )) as Result<any>;
    expect(response).toBeInstanceOf(Result);
    expect(response.isFailure()).toBe(true);
    expect(response.getError()).toBeInstanceOf(DataNotFoundError);
  });

  it('should be error recovery password with send email failed', async () => {
    jest
      .spyOn(sut as any, 'sendEmailRecoveryCode') //only private method access
      .mockReturnValue(new DependencyError('huehue'));
    const response = (await sut.execute(
      UserStub.recoveryPasswordSendCodeCommandStub(),
    )) as Result<any>;
    expect(response).toBeInstanceOf(Result);
    expect(response.isFailure()).toBe(true);
    expect(response.getError()).toBeInstanceOf(DependencyError);
  });

  it('should be error recovery password with persist recovery code', async () => {
    jest
      .spyOn(repo as any, 'save') //only private method access
      .mockReturnValue(new InfrastructureError('huehue'));
    const response = (await sut.execute(
      UserStub.recoveryPasswordSendCodeCommandStub(),
    )) as Result<any>;
    expect(response).toBeInstanceOf(Result);
    expect(response.isFailure()).toBe(true);
    expect(response.getError()).toBeInstanceOf(InfrastructureError);
  });
});
