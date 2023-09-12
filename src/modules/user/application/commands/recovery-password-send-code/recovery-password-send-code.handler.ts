import { ActionHandlerInterface } from '@core/application';
import {
  EmailClientInterface,
  SendEmailOptions,
} from '@core/domain/contracts/email-client.interface';

import { Result } from '@core/application/result';
import { RecoveryPasswordSendCodeRepositoryInterface } from '@module/user/domain/contracts/recovery-password-send-code.repository.interface';
import { UserAggregateRoot } from '@module/user/domain/user.aggregate-root';
import { RecoveryPasswordSendCodeCommand } from './recovery-password-send-code.command';
import { AbstractError, ErrorFactory } from '@core/domain/errors';

type response = Result<AbstractError<any> | Partial<any>> | void;
export class RecoveryPasswordSendCodeHandler
  implements ActionHandlerInterface<RecoveryPasswordSendCodeCommand, response>
{
  constructor(
    private sendCodeRepo: RecoveryPasswordSendCodeRepositoryInterface,
    private emailClient: EmailClientInterface,
  ) {}
  async execute(command: RecoveryPasswordSendCodeCommand): Promise<response> {
    const resultOrError = (await this.sendCodeRepo.findUserRecoveryPassword(
      command.username,
    )) as UserAggregateRoot;
    if (resultOrError instanceof AbstractError) {
      return Result.failure(resultOrError);
    }

    const recoveryCode = this.generateRecoveyPassword();
    resultOrError.setRecoveryCode(recoveryCode);

    const resultRepo = await this.sendCodeRepo.save(
      resultOrError as UserAggregateRoot,
    );

    if (resultRepo instanceof AbstractError) {
      return Result.failure(resultRepo);
    }
    const email = (resultOrError as UserAggregateRoot)
      .getPerson()
      .getContacts()
      .find(
        contact =>
          contact.isMain() == true && contact.getContactType().getId() == 1,
      );
    if (email == undefined)
      return Result.failure(
        ErrorFactory.instance().create('notFound', 'email not exists'),
      );

    const sendEmailResult = await this.sendEmailRecoveryCode(
      recoveryCode,
      email.getDescription(),
    );

    if (sendEmailResult instanceof AbstractError) {
      return Result.failure(sendEmailResult);
    }
    return Result.success({
      email: this.ofuschEmail(email.getDescription()),
      userUuid: resultOrError.getUuid(),
    });
  }

  private generateRecoveyPassword(): string {
    return Math.random().toString(36).slice(2, 8).toUpperCase();
  }

  private async sendEmailRecoveryCode(
    recoveryCode: string,
    email: string,
  ): Promise<Partial<any> | AbstractError<any>> {
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
