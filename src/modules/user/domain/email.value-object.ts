import { ValueObject } from '@core/domain';
import { DomainError } from '@core/domain/errors';

export class EmailValueObject extends ValueObject {
  private static EMAIL_REGES_VALIDATION =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  private constructor(readonly value: string) {
    super();
  }

  private static validate(value: string): Array<string> {
    const errors = [];
    if (value == undefined || value == null) errors.push('email is empty');

    if (EmailValueObject.EMAIL_REGES_VALIDATION.test(value))
      errors.push('invalid email');

    return errors;
  }

  static create(value: string): EmailValueObject | DomainError {
    const validation = EmailValueObject.validate(value);
    if (validation.length > 0) return new DomainError(validation);

    return new EmailValueObject(value);
  }

  getValue() {
    return this.value;
  }
}
