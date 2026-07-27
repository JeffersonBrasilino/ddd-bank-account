import { DomainValidatorInterface } from './domain-validator.interface';

export class RequiredValidator implements DomainValidatorInterface {
  validate(value): boolean {
    if (typeof value == 'boolean' && value != undefined) {
      return true;
    }

    return !!value;
  }

  getErrors(): string {
    return `is required`;
  }
}
