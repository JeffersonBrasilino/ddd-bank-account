import { Module } from '@nestjs/common';
import { UserModule } from './user/infrastructure/user.module';

const MODULES = [
  // UserModule,
  /* PickUpPointsModule */
];
@Module({
  imports: [...MODULES],
  exports: [...MODULES],
})
export class ModulesModule {}
