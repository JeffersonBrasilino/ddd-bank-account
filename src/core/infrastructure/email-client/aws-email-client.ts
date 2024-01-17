import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import {
  EmailClientInterface,
  SendEmailOptions,
} from '../../domain/contracts/email-client.interface';
import { AbstractError, ErrorFactory } from '@core/domain/errors';
export type configProps = {
  awsSesKey: string;
  awsSesToken: string;
  awsSesRegion: string;
  awsSesDefaultEmail: string;
};
export class AwsEmailClient implements EmailClientInterface {
  private SESinstance: SESClient;

  constructor(private config: configProps) {
    this.validateCredencials();
    this.createSesInstance();
  }
  private validateCredencials() {
    if (
      !this.config.awsSesKey &&
      !this.config.awsSesRegion &&
      !this.config.awsSesToken
    )
      throw new Error('credenciais AWS SES invalidas.');
  }
  private createSesInstance() {
    this.SESinstance = new SESClient({
      region: this.config.awsSesRegion,
      credentials: {
        accessKeyId: this.config.awsSesKey,
        secretAccessKey: this.config.awsSesToken,
      },
    });
  }

  async sendEmail(
    settings: SendEmailOptions,
  ): Promise<Partial<any> | AbstractError<any>> {
    try {
      const command = new SendEmailCommand({
        Destination: {
          ToAddresses: [`${settings.to}`],
        },
        Message: {
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: settings.html,
            },
          },
          Subject: {
            Charset: 'UTF-8',
            Data: settings.subject,
          },
        },
        Source: settings.from ?? this.config.awsSesDefaultEmail,
      });
      const result = await this.SESinstance.send(command);
      return { success: !!result?.MessageId, response: result };
    } catch (err) {
      return ErrorFactory.create('Dependency', err.toString());
    }
  }
}
