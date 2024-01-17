import { DomainValidatorInterface } from './domain-validator.interface';

export class RegexValidator implements DomainValidatorInterface {
  constructor(private regex: RegExp) {}
  validate(value: string): boolean {
    return new RegExp(this.regex).test(value);
  }

  getErrors(): string {
    return `is not valid to RegexValidator`;
  }
}
