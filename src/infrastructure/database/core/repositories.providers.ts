import { Provider } from '@nestjs/common';
import { AccountRepository } from '../typeorm/repositories/account.repository';

export const AccountRepositoryProvider: Provider = {
  provide: 'IAccountRepository',
  useClass: AccountRepository,
};
