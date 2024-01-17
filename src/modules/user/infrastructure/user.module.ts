import { ActionFactory } from '@core/application';
import { AwsEmailClient } from '@core/infrastructure/email-client/aws-email-client';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AwsEmailConfig } from 'src/config/aws-email.config';
import { UserMapper } from '../mapper/user.mapper';
import { JwtAuthToken } from './auth-token/jwt.auth-token';
import { ACTIONS, actions } from './cqrs/actions.types';
import { LoginCommandHandler } from './cqrs/login-command.handler';
import { RecoveryPasswordNewPasswordHandler } from './cqrs/recovery-password-new-password.handler';
import { RecoveryPasswordSendCodeHandler } from './cqrs/recovery-password-send-code.handler';
import { RefreshAuthTokenHandler } from './cqrs/refresh-auth-token.handler';
import { UserExistsQueryHandler } from './cqrs/user-exists.query.handler';
import { UserSaveFirstLoginHandler } from './cqrs/user-save-first-login.handler';
import { BCryptBassword } from './crypt-password/bcrypt-password';
import { UserRepository } from './database/typeorm/repositories/user.repository';
import { UserExistsGateway } from './gateway/user-exists.gateway';
import { LoginController } from './http/login/login.controller';
import { RefreshAuthTokenController } from './http/refresh-auth-token/refresh-auth-token.controller';
import { TestController } from './http/test.controller';
import { UserExistsController } from './http/user-exists/user-exists.controller';
import { UserSaveFirstLoginController } from './http/user-save-first-login/user-save-first-login.controller';
import { UserController } from './http/user.controller';

@Module({
  imports: [
    CqrsModule,
    HttpModule,
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
  controllers: [
    UserController,
    UserExistsController,
    UserSaveFirstLoginController,
    TestController,
    LoginController,
    RefreshAuthTokenController,
  ],
  providers: [
    LoginCommandHandler,
    RecoveryPasswordSendCodeHandler,
    RecoveryPasswordNewPasswordHandler,
    UserExistsQueryHandler,
    UserSaveFirstLoginHandler,
    RefreshAuthTokenHandler,
    UserMapper,
    ConfigService,
    {
      provide: 'ActionFactory',
      useFactory: () => new ActionFactory<actions>(ACTIONS),
    },
    {
      provide: 'UserRepository',
      useFactory: mapper => new UserRepository(mapper),
      inject: [UserMapper],
    },
    {
      provide: 'CryptPassword',
      useClass: BCryptBassword,
    },
    {
      provide: 'AuthToken',
      useFactory: (jwtService, configService) =>
        new JwtAuthToken(jwtService, configService),
      inject: [JwtService, ConfigService],
    },
    {
      provide: 'EmailClient',
      useFactory: config => new AwsEmailClient(config.get('aws-ses')),
      inject: [ConfigService],
    },
    {
      provide: 'UserSaveFirstLoginRepository',
      useExisting: 'UserRepository',
    },
    { provide: 'UserExistsRepository', useExisting: 'UserRepository' },
    {
      provide: 'LoginRepo',
      useExisting: 'UserRepository',
    },
    {
      provide: 'SendCodeRecoveryPassword',
      useExisting: 'UserRepository',
    },
    {
      provide: 'RecoveryPasswordNewPasswordRepositoryInterface',
      useExisting: 'UserRepository',
    },
    {
      provide: 'RefreshAuthTokenRepositoryInterface',
      useExisting: 'UserRepository',
    },
  ],
  exports: [],
})
export class UserModule {}
