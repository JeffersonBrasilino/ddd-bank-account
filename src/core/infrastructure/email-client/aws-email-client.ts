import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { AbstractError, ErrorFactory } from '@core/domain/errors';
import { Logger } from '@nestjs/common';
import {
  EmailClientInterface,
  SendEmailOptions,
} from '../../domain/contracts/email-client.interface';

export type configProps = {
  awsSesKey: string;
  awsSesToken: string;
  awsSesRegion: string;
  awsSesDefaultEmail: string;
  awsSesEndpoint?: string; // Para LocalStack
};

export type EmailEnvironment = 'production' | 'development';

export class AwsEmailClient implements EmailClientInterface {
  private SESinstance: SESClient;
  private environment: EmailEnvironment;
  private readonly logger = new Logger(AwsEmailClient.name);

  constructor(private config: configProps) {
    this.validateCredencials();
    this.detectEnvironment();
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

  private detectEnvironment() {
    const isLocalStack =
      this.config.awsSesEndpoint &&
      (this.config.awsSesKey === 'test' || this.config.awsSesToken === 'test');

    this.environment = isLocalStack ? 'development' : 'production';
  }

  private createSesInstance() {
    const clientConfig: any = {
      region: this.config.awsSesRegion,
      credentials: {
        accessKeyId: this.config.awsSesKey,
        secretAccessKey: this.config.awsSesToken,
      },
    };

    // Se endpoint estiver definido (LocalStack), adiciona à configuração
    if (this.config.awsSesEndpoint) {
      clientConfig.endpoint = this.config.awsSesEndpoint;
      clientConfig.forcePathStyle = true; // Necessário para LocalStack
    }

    this.SESinstance = new SESClient(clientConfig);
  }

  async sendEmail(
    settings: SendEmailOptions,
  ): Promise<Partial<any> | AbstractError<any>> {
    try {
      const command = new SendEmailCommand({
        Destination: {
          ToAddresses: Array.isArray(settings.to) ? settings.to : [settings.to],
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

      if (this.environment === 'development') {
        this.logger.log(
          `[DEV] Email enviado com sucesso via LocalStack para: ${settings.to}`,
        );
        this.logger.log(`[DEV] MessageId: ${result?.MessageId}`);
      }

      return { success: !!result?.MessageId, response: result };
    } catch (err) {
      const errorMessage = err.toString();

      if (this.environment === 'development') {
        const developmentErrors = [
          'Email address not verified',
          'Email address not confirmed',
          'Domain not verified',
          'Identity not found',
          'InvalidParameterValue',
          'MessageRejected',
        ];

        const isDevelopmentError = developmentErrors.some(errorType =>
          errorMessage.includes(errorType),
        );

        if (isDevelopmentError) {
          this.logger.log(
            `[DEV] Erro de desenvolvimento detectado: ${errorMessage}`,
          );
          this.logger.log(
            `[DEV] Simulando envio de email para: ${settings.to}`,
          );
          this.logger.log(`[DEV] Assunto: ${settings.subject}`);
          this.logger.log(
            `[DEV] Remetente: ${settings.from ?? this.config.awsSesDefaultEmail}`,
          );

          return {
            success: true,
            response: {
              MessageId: `dev-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              Environment: 'development',
              Simulated: true,
              Error: errorMessage,
            },
          };
        }
      }

      return ErrorFactory.create('Dependency', errorMessage);
    }
  }
}
