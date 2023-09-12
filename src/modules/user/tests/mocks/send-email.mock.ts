import {
  EmailClientInterface,
  SendEmailOptions,
} from '@core/domain/contracts/email-client.interface';

export class SendEmailMock implements EmailClientInterface {
  async sendEmail(settings: SendEmailOptions): Promise<any> {
    return true;
  }
}
