import { DomainValidatorInterface } from './domain-validator.interface';

export class RegexValidator implements DomainValidatorInterface {
  private errorMessage = `is not valid to RegexValidator`;
  constructor(private regex: RegExp) {}
  validate(value: string): boolean {
    return new RegExp(this.regex).test(value);
  }

  withErrorMessage(message: string): DomainValidatorInterface {
    this.errorMessage = message;
    return this;
  }
  getErrors(): string {
    return this.errorMessage;
  }
}
