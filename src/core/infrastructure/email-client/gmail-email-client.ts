import { AbstractError, ErrorFactory } from '@core/domain/errors';
import { Logger } from '@nestjs/common';
import nodemailer from 'nodemailer';
import {
  EmailClientInterface,
  SendEmailOptions,
} from '../../domain/contracts/email-client.interface';

export type GmailConfigProps = {
  gmailUser: string;
  gmailAppPassword: string;
  defaultEmail: string;
};

export class GmailEmailClient implements EmailClientInterface {
  private readonly transporter: nodemailer.Transporter;
  private readonly logger = new Logger(GmailEmailClient.name);

  constructor(private config: GmailConfigProps) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.config.gmailUser,
        pass: this.config.gmailAppPassword,
      },
    });
  }

  async sendEmail(
    settings: SendEmailOptions,
  ): Promise<Partial<{ success: boolean; response: any }> | AbstractError<any>> {
    try {
      const to = Array.isArray(settings.to) ? settings.to : [settings.to];
      const html = settings.html ?? settings.body ?? settings.text ?? '';

      const info = await this.transporter.sendMail({
        from: settings.from ?? this.config.defaultEmail,
        to,
        subject: settings.subject,
        html: html || undefined,
        text: settings.text || undefined,
      });

      if (process.env.NODE_ENV === 'development') {
        this.logger.log(
          `[DEV] Email enviado com sucesso via Gmail para: ${settings.to}`,
        );
        this.logger.log(`[DEV] MessageId: ${info.messageId}`);
      }

      return { success: !!info.messageId, response: { messageId: info.messageId } };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      this.logger.error(`[Gmail] Erro ao enviar email: ${errorMessage}`);
      return ErrorFactory.create('Dependency', errorMessage);
    }
  }
}
