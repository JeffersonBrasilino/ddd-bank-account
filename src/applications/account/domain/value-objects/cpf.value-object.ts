import { Result } from '@core/shared/result';
import { ValueObject } from '@core/domain/value-object';

export class CpfValueObject extends ValueObject {
  private static CPF_VALIDATE_REGEX =
    /([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})/;
  private _cpf: string;
  public get value(): string {
    return this._cpf;
  }

  private constructor(value: string) {
    super();
    this._cpf = CpfValueObject.normalize(value);
  }

  static isValid(value: string): boolean {
    const rgx = new RegExp(this.CPF_VALIDATE_REGEX);
    return !!(value.match(rgx) && CpfValueObject.normalize(value).length == 11);
  }

  static normalize(value: string): string {
    return value.replace(new RegExp(/[^0-9]/g), '');
  }

  static create(value: string): Result<CpfValueObject> {
    if (!value) return Result.fail<CpfValueObject>('cpf nao pode ser vazio.');

    if (CpfValueObject.isValid(value) == false)
      return Result.fail<CpfValueObject>('cpf invalido');

    return Result.ok<CpfValueObject>(new CpfValueObject(value));
  }
}
