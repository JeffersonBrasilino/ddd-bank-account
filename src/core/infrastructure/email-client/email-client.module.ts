import { EmailClientInterface } from '@core/domain/contracts/email-client.interface';
import { AwsEmailClient } from '@core/infrastructure/email-client/aws-email-client';
import { GmailEmailClient } from '@core/infrastructure/email-client/gmail-email-client';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [
    {
      provide: 'EmailClient',
      useFactory: (configService: ConfigService): EmailClientInterface => {
        const provider = process.env.EMAIL_PROVIDER || 'ses';

        if (provider === 'gmail') {
          const gmailConfig =
            configService.get('gmail-email') ?? {
              gmailUser: process.env.GMAIL_USER,
              gmailAppPassword: process.env.GMAIL_APP_PASSWORD,
              defaultEmail:
                process.env.DEFAULT_EMAIL_ADDRESS || process.env.GMAIL_USER,
            };
          if (!gmailConfig?.gmailUser || !gmailConfig?.gmailAppPassword) {
            throw new Error(
              'Gmail config missing: GMAIL_USER and GMAIL_APP_PASSWORD are required when EMAIL_PROVIDER=gmail',
            );
          }
          return new GmailEmailClient({
            gmailUser: gmailConfig.gmailUser,
            gmailAppPassword: gmailConfig.gmailAppPassword,
            defaultEmail: gmailConfig.defaultEmail || gmailConfig.gmailUser,
          });
        }

        const awsConfig =
          configService.get('aws-ses') ?? {
            awsSesKey: process.env.AWS_SES_KEY,
            awsSesToken: process.env.AWS_SES_TOKEN,
            awsSesRegion: process.env.AWS_SES_REGION,
            awsSesDefaultEmail: process.env.DEFAULT_EMAIL_ADDRESS,
            awsSesEndpoint: process.env.AWS_SES_ENDPOINT,
          };
        return new AwsEmailClient({
          awsSesKey: awsConfig.awsSesKey,
          awsSesToken: awsConfig.awsSesToken,
          awsSesRegion: awsConfig.awsSesRegion,
          awsSesDefaultEmail: awsConfig.awsSesDefaultEmail,
          awsSesEndpoint: awsConfig.awsSesEndpoint,
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: ['EmailClient'],
})
export class EmailClientModule {}
