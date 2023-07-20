import { ActionFactory } from '@core/application';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserMapper } from '../mapper/user.mapper';
import { JwtAuthToken } from './auth-token/jwt.auth-token';
import { ACTIONS, actions } from './cqrs/actions.types';
import { LoginCommandHandler } from './cqrs/login-command.handler';
import { BCryptBassword } from './crypt-password/bcrypt-password';
import { UserRepository } from './database/repositories/user.repository';
import { UserController } from './http/user.controller';
import { RecoveryPasswordSendCodeHandler } from './cqrs/recovery-password-send-code.handler';
import { AwsEmailConfig } from 'src/config/aws-email.config';
import { AwsEmailClient } from '@core/infrastructure/email-client/aws-email-client';
import { RecoveryPasswordNewPasswordHandler } from './cqrs/recovery-password-new-password';
import { TestController } from './http/test.controller';

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forFeature(AwsEmailConfig()),
    JwtModule.registerAsync({
      useFactory: async (config: ConfigService) => {
        const appConfig = config.get('app');
        return {
          secret: appConfig.apiAuthTokenSalt,
          signOptions: {
            expiresIn: appConfig.apiAuthTokenExpiration,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [UserController, TestController],
  providers: [
    LoginCommandHandler,
    RecoveryPasswordSendCodeHandler,
    RecoveryPasswordNewPasswordHandler,
    UserMapper,
    ConfigService,
    {
      provide: 'ActionFactory',
      useFactory: () => new ActionFactory<actions>(ACTIONS),
    },
    {
      provide: 'UserRepositoryInterface',
      useFactory: mapper => new UserRepository(mapper),
      inject: [UserMapper],
    },
    {
      provide: 'CryptPassword',
      useClass: BCryptBassword,
    },
    {
      provide: 'AuthToken',
      useFactory: jwtService => new JwtAuthToken(jwtService),
      inject: [JwtService],
    },
    {
      provide: 'EmailClient',
      useFactory: config => new AwsEmailClient(config.get('aws-ses')),
      inject: [ConfigService],
    },
  ],
  exports: [],
})
export class UserModule {}
