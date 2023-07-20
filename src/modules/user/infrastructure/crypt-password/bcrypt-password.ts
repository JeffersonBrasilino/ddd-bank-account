import { CryptPasswordInterface } from '@module/user/domain/contracts/crypt-password.interface';
import * as bcrypt from 'bcrypt';
export class BCryptBassword implements CryptPasswordInterface {
  private SALT_HASH = 10;
  check(rawPassword: string, hashPassword: string): boolean {
    return bcrypt.compareSync(rawPassword, hashPassword);
  }

  crypt(rawPassword: string): string {
    return bcrypt.hashSync(rawPassword, this.SALT_HASH);
  }
}
