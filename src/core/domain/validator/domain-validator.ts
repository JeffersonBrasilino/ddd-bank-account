import { DomainValidatorInterface } from './domain-validator.interface';

export class DomainValidator implements DomainValidatorInterface {
  private validationUnits: Map<string, any> = new Map<
    string,
    DomainValidatorInterface
  >();
  private errors: { [k: string]: string | Array<string> } = {};

  validate(data: Partial<any>): boolean {
    let valid = true;
    for (const [attribute, validator] of this.validationUnits) {
      const isValid = validator.validate(data[attribute]);
      if (isValid == false) {
        valid = false;
        this.errors[attribute] = validator.getErrors();
      }
    }
    return valid;
  }

  addAttribute(
    field: string,
    validatorUnit: DomainValidatorInterface,
  ): DomainValidator {
    this.validationUnits.set(field, validatorUnit);
    return this;
  }

  getErrors(): { [k: string]: string | Array<string> } {
    return this.errors;
  }
}
