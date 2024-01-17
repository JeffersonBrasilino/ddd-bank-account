import { DomainValidatorInterface } from './domain-validator.interface';

export class InstanceOfValidator implements DomainValidatorInterface {
  constructor(private instance: object) {}
  validate(value): boolean {
    return value instanceof (this.instance as any);
  }

  getErrors(): string {
    return `is not instance of ${
      (this.instance as any).prototype.constructor.name
    }`;
  }
}
