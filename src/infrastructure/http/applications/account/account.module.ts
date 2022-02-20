import { AccountRepositoryProvider } from '@infrastructure/database/core/repositories.providers';
import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';

@Module({
  controllers: [AccountController],
  providers: [AccountRepositoryProvider],
})
export class AccountModule {}
