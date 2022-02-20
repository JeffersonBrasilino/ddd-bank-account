import { TypeormConnection } from '@infrastructure/database/core/typeorm.connection';
import { ApplicationsModule } from '@infrastructure/http/applications/applications.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ApplicationsModule,
    TypeOrmModule.forRootAsync({
      useFactory: () => ({}),
      connectionFactory: async () => {
        return TypeormConnection.connect();
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
