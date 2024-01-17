import { ValueObject } from '@core/domain';
import { AbstractError, ErrorFactory } from '@core/domain/errors';
import { MinLengthValidator, RequiredValidator } from '@core/domain/validator';
import {
  DomainValidatorFactory,
  domainValidatorSchemaProps,
} from '@core/domain/validator/domain-validator.factory';

export class CpflValueObject extends ValueObject {
  private constructor(private readonly value: string) {
    super();
  }

  private static validate(value: string): AbstractError<any> | boolean {
    const validateProps: domainValidatorSchemaProps = {
      value: [new RequiredValidator(), new MinLengthValidator(11)],
    };
    const validation = DomainValidatorFactory.create(validateProps);
    if (validation.validate({ value }) == false) {
      return ErrorFactory.create('Validation', validation.getErrors());
    }
    if (!CpflValueObject.isValidCPF(value))
      return ErrorFactory.create('Validation', 'CPF is not valid');
    return true;
  }

  static create(value: string): CpflValueObject | AbstractError<any> {
    value = CpflValueObject.removeSpecialCharacters(value);
    const validation = CpflValueObject.validate(value);
    if (validation instanceof AbstractError) return validation;

    return new CpflValueObject(value);
  }

  getValue() {
    return this.value;
  }

  static removeSpecialCharacters(value: string): string {
    return value.replace(/[\D]+/g, '');
  }

  static isValidCPF(value: string): boolean {
    if (value.match(/(\d)\1{10}/)) return false;

    const cpf = value.split('').map(el => +el);
    const rest = count =>
      ((cpf
        .slice(0, count - 12)
        .reduce((soma, el, index) => soma + el * (count - index), 0) *
        10) %
        11) %
      10;
    return rest(10) === cpf[9] && rest(11) === cpf[10];
  }
}
