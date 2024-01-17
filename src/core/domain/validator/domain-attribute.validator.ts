import { DomainValidatorInterface } from './domain-validator.interface';
export class DomainAttributeValidator implements DomainValidatorInterface {
  private validatorUnits: DomainValidatorInterface[] = [];
  private errors = [];
  constructor(...validators: DomainValidatorInterface[]) {
    this.validatorUnits = this.validatorUnits.concat(validators);
  }
  addValidator(validator: DomainValidatorInterface): DomainAttributeValidator {
    this.validatorUnits.push(validator);
    return this;
  }
  validate(value: any): boolean {
    let valid = true;
    for (const validator of this.validatorUnits) {
      if (validator.validate(value) == false) {
        this.errors.push(validator.getErrors());
        valid = false;
      }
    }
    return valid;
  }

  getErrors(): Array<string> {
    return this.errors;
  }
}
