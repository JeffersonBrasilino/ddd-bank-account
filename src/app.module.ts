import { TypeormConnection } from '@core/infrastructure/database/typeorm/typeorm.connection';
import { HttpErrorFilter } from '@core/infrastructure/http/nestjs/filters/http-error.filter';
import {
  UserAuthenticationStrategy,
  UserAuthenticationGuard,
} from '@core/infrastructure/http/nestjs/guards/user/authentication';
import { HttpResponseTransformInterceptor } from '@core/infrastructure/http/nestjs/interceptors/http-response-transform.interceptor';
import { ModulesModule } from '@module/modules.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, Reflector } from '@nestjs/core';
import { APP_GUARD } from '@nestjs/core/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { appConfig } from './config/app.config';
import { UserAuthirizationRepository } from '@module/user/infrastructure/database/repositories/user-authorization.repository';
import { UserAuthorizationGuard } from '@core/infrastructure/http/nestjs/guards/user/authorization';
import { ApplicationAuthenticationGuard } from '@core/infrastructure/http/nestjs/guards/application/application-authentication.guard';
import { ApplicationAuthenticationRepository } from '@module/application/infrastructure/database/repositories/application-authentication.repository';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      envFilePath:
        process.env.NODE_ENV === 'development' ? '.env' : '.env.test',
      expandVariables: process.env.NODE_ENV !== 'production',
      cache: true,
      isGlobal: true,
      load: [appConfig()],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({}),
      dataSourceFactory: async () => {
        return await TypeormConnection.connect();
      },
    }),
    ModulesModule,
  ],
  providers: [
    {
      provide: 'UserAuthirizationDataSource',
      useClass: UserAuthirizationRepository,
    },
    {
      provide: 'ApplicationAuthenticationDataSource',
      useClass: ApplicationAuthenticationRepository,
    },
    UserAuthenticationStrategy,
    { provide: APP_INTERCEPTOR, useClass: HttpResponseTransformInterceptor },
    { provide: APP_FILTER, useClass: HttpErrorFilter },
    {
      provide: APP_GUARD,
      useFactory: (reflector, dataSource) => {
        return new ApplicationAuthenticationGuard(reflector, dataSource);
      },
      inject: [Reflector, 'ApplicationAuthenticationDataSource'],
    }, //1
    { provide: APP_GUARD, useClass: UserAuthenticationGuard }, //2
    {
      provide: APP_GUARD,
      useFactory: (reflector, dataSource) => {
        return new UserAuthorizationGuard(reflector, dataSource);
      },
      inject: [Reflector, 'UserAuthirizationDataSource'],
    }, //3
  ],
})
export class AppModule {}
