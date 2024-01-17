import { DomainValidatorInterface } from './domain-validator.interface';

export class RequiredValidator implements DomainValidatorInterface {
  validate(value): boolean {
    return !!value;
  }

  getErrors(): string {
    return `is required`;
  }
}
