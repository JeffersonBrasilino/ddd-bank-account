import { DomainValidatorInterface } from './domain-validator.interface';

export class MinLengthValidator implements DomainValidatorInterface {
  constructor(private length: number) {}
  validate(value): boolean {
    const valueLength = value?.length;
    if (valueLength === undefined) {
      return false;
    }
    return valueLength >= this.length;
  }

  getErrors(): string {
    return `must be at least ${this.length} characters`;
  }
}
