import { ActionHandlerInterface } from '@core/application';
import {
  EmailClientInterface,
  SendEmailOptions,
} from '@core/domain/contracts/email-client.interface';
import {
  DataNotFoundError,
  InfrastructureError,
} from '@core/infrastructure/errors';
import { Result } from '@core/shared/result';
import { UserRepositoryInterface } from '@module/user/domain/contracts/user-repository.interface';
import { RecoveryPasswordSendCodeCommand } from './recovery-password-send-code.command';
import { UserAggregateRoot } from '@module/user/domain/user.aggregate-root';
import { DependencyError } from '@core/infrastructure/errors/dependency.error';

type response = Result<any> | void;
export class RecoveryPasswordSendCodeHandler
  implements ActionHandlerInterface<RecoveryPasswordSendCodeCommand, response>
{
  constructor(
    private userRepo: UserRepositoryInterface,
    private emailClient: EmailClientInterface,
  ) {}
  async execute(command: RecoveryPasswordSendCodeCommand): Promise<response> {
    const resultOrError = (await this.userRepo.findUserRecoveryPassword(
      command.username,
    )) as UserAggregateRoot;
    if (resultOrError instanceof DataNotFoundError) {
      return Result.failure<DataNotFoundError>(resultOrError);
    }

    const recoveryCode = this.generateRecoveyPassword();
    resultOrError.setRecoveryCode(recoveryCode);

    const resultRepo = await this.userRepo.saveRecoveryPasswordCode(
      resultOrError as UserAggregateRoot,
    );

    if (resultRepo instanceof InfrastructureError) {
      return Result.failure(resultRepo);
    }
    const email = (resultOrError as UserAggregateRoot)
      .getPerson()
      .getContacts()[0]
      .getDescription();
    const sendEmailResult = await this.sendEmailRecoveryCode(
      recoveryCode,
      email,
    );

    if (sendEmailResult instanceof DependencyError) {
      return Result.failure(sendEmailResult);
    }
    return Result.success({
      email: this.ofuschEmail(email),
      userUuid: resultOrError.getUuid(),
    });
  }

  private generateRecoveyPassword(): string {
    return Math.random().toString(36).slice(2, 8).toUpperCase();
  }

  private async sendEmailRecoveryCode(
    recoveryCode: string,
    email: string,
  ): Promise<Partial<any> | DependencyError> {
    const opt: SendEmailOptions = {
      to: email,
      subject:
        'Código de verificação - recuperar senha ' + process.env.API_NAME,
      html: `código de verificação: <b>${recoveryCode}</b>`,
    };
    const sendEmailResult = await this.emailClient.sendEmail(opt);
    return sendEmailResult;
  }

  private ofuschEmail(email: string): string {
    return email.replace(/(\w{3})[\w.-]+@([\w.]+\w)/, '$1***@$2');
  }
}
