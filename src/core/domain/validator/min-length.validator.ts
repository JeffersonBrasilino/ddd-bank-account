import { DomainValidatorInterface } from './domain-validator.interface';

export class MinLengthValidator implements DomainValidatorInterface {
  constructor(private length: number) {}
  validate(value): boolean {
    return value.length == this.length;
  }

  getErrors(): string {
    return `is required`;
  }
}
