import { CryptPasswordInterface } from '@module/user/domain/contracts/crypt-password.interface';

export class CryptPasswordMock implements CryptPasswordInterface {
  check(rawPassword: string, hashPassword: string): boolean {
    return rawPassword === hashPassword;
  }
  crypt(rawPassword: string): string {
    return 'cryptedPassword';
  }
}
