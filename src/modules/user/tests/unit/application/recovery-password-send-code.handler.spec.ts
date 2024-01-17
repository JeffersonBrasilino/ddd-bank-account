import { Result } from '@core/application/result';
import { ErrorFactory } from '@core/domain/errors';
import { DependencyError } from '@core/domain/errors/dependency.error';
import { NotFoundError } from '@core/domain/errors/not-found.error';
import { RecoveryPasswordSendCodeHandler } from '@module/user/application/commands/recovery-password-send-code/recovery-password-send-code.handler';
import { SendEmailMock } from '../../mocks/send-email.mock';
import { userRepo } from '../../mocks/user.repository.mock';
import { UserStub } from '../../stubs/user.stub';

describe('RecoveryPasswordSendCodeHandler', () => {
  let sut: RecoveryPasswordSendCodeHandler;
  beforeAll(() => {
    sut = new RecoveryPasswordSendCodeHandler(userRepo, SendEmailMock);
  });
    beforeEach(() => {
      jest.restoreAllMocks();
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
    expect(response.getError()).toBeInstanceOf(NotFoundError);
  });

  it('should be error recovery password with send email failed', async () => {
    jest
      .spyOn(sut as any, 'sendEmailRecoveryCode') //only private method access
      .mockReturnValue(ErrorFactory.create('Dependency'));
    const response = (await sut.execute(
      UserStub.recoveryPasswordSendCodeCommandStub(),
    )) as Result<any>;
    expect(response).toBeInstanceOf(Result);
    expect(response.isFailure()).toBe(true);
    expect(response.getError()).toBeInstanceOf(DependencyError);
  });

  it('should be error recovery password with not found email', async () => {
    const response = (await sut.execute(
      UserStub.recoveryPasswordSendCodeCommandStub('not_found_email'),
    )) as Result<any>;
    expect(response).toBeInstanceOf(Result);
    expect(response.isFailure()).toBe(true);
    expect(response.getError()).toBeInstanceOf(NotFoundError);
  });

  it('should be error recovery password with persist recovery code', async () => {
    jest
      .spyOn(userRepo as any, 'save') //only private method access
      .mockReturnValue(ErrorFactory.create('Dependency'));
    const response = (await sut.execute(
      UserStub.recoveryPasswordSendCodeCommandStub(),
    )) as Result<any>;
    expect(response).toBeInstanceOf(Result);
    expect(response.isFailure()).toBe(true);
    expect(response.getError()).toBeInstanceOf(DependencyError);
  });
});
