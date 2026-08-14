import { DomainValidatorInterface } from './domain-validator.interface';

export class DomainValidator implements DomainValidatorInterface {
  private validationUnits: Map<string, any> = new Map<
    string,
    DomainValidatorInterface
  >();
  private errors: { [k: string]: string | Array<string> } = {};

  validate(data: Partial<any>): boolean {
    let valid = true;
    this.errors = {}; // Limpa erros anteriores
    for (const [attribute, validator] of this.validationUnits) {
      const isValid = validator.validate(data[attribute]);
      if (isValid === false) {
        valid = false;
        const validatorErrors = validator.getErrors();
        if (!this.errors[attribute]) {
          this.errors[attribute] = [];
        }
        // Garante que sempre será um array de strings
        if (Array.isArray(validatorErrors)) {
          this.errors[attribute] = [
            ...this.errors[attribute],
            ...validatorErrors,
          ];
        } else if (typeof validatorErrors === 'string') {
          this.errors[attribute] = [...this.errors[attribute], validatorErrors];
        }
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
