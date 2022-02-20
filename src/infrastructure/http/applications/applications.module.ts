import { Module } from '@nestjs/common';
import { AccountModule } from './account/account.module';

const MODULES = [AccountModule];

@Module({
  imports: [...MODULES],
})
export class ApplicationsModule {}
