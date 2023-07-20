import { ValueObject } from '@core/domain';
import { DomainError } from '@core/domain/errors';
import { CryptPasswordInterface } from './contracts/crypt-password.interface';

export class PasswordValueObject extends ValueObject {
  private constructor(private value: string) {
    super();
  }

  private static validate(value: string): Array<string> {
    const errors = [];
    if (value == undefined || value == null)
      errors.push('invalid password: is empty string');
    return errors;
  }

  static create(value: string): PasswordValueObject | DomainError {
    const validation = PasswordValueObject.validate(value);
    if (validation.length > 0) return new DomainError(validation);

    return new PasswordValueObject(value);
  }

  getValue() {
    return this.value;
  }

  crypt(cryptStrategy: CryptPasswordInterface) {
    this.value = cryptStrategy.crypt(this.value);
  }
}
