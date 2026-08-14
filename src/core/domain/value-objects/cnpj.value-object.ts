import { ValueObject } from '@core/domain';
import { AbstractError, ErrorFactory } from '@core/domain/errors';
import { cnpj } from 'cpf-cnpj-validator';

export class CnpjValueObject extends ValueObject {
  private constructor(readonly _value: string) {
    super();
  }

  static create(value: string): CnpjValueObject | AbstractError<any> {
    const stripped = cnpj.strip(value);
    if (!cnpj.isValid(stripped)) {
      return ErrorFactory.create('Validation', 'CNPJ inválido');
    }
    return new CnpjValueObject(stripped);
  }

  getValue(): string {
    return this._value;
  }

  getStripped(): string {
    return cnpj.strip(this._value);
  }

  value(): string {
    return this._value;
  }
}
