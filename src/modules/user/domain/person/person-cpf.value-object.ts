import { ValueObject } from '@core/domain';
import { AbstractError, ErrorFactory } from '@core/domain/errors';

export class CpflValueObject extends ValueObject {
  private constructor(private readonly value: string) {
    super();
  }

  private static validate(value: string): Array<string> {
    const errors = [];
    if (value == undefined || value == null) errors.push('CPF is empty');
    if (value.length != 11) errors.push('CPF length is invalid');
    if (!CpflValueObject.isValidCPF(value)) errors.push('CPF is not valid');

    return errors;
  }

  static create(value: string): CpflValueObject | AbstractError<any> {
    value = CpflValueObject.removeSpecialCharacters(value);
    const validation = CpflValueObject.validate(value);
    if (validation.length > 0)
      ErrorFactory.instance().create('InvalidData', validation);

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
