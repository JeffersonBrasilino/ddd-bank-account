import { AbstractError } from '@core/domain/errors';
import { CnpjValueObject } from '@core/domain/value-objects/cnpj.value-object';

describe('CnpjValueObject', () => {
  it('should create a valid numeric CNPJ with mask', () => {
    const result = CnpjValueObject.create('11.222.333/0001-81');
    expect(result).toBeInstanceOf(CnpjValueObject);
  });

  it('should create a valid alphanumeric CNPJ with mask', () => {
    const result = CnpjValueObject.create('12.ABC.345/01DE-35');
    expect(result).toBeInstanceOf(CnpjValueObject);
  });

  it('should create a valid alphanumeric CNPJ without mask', () => {
    const result = CnpjValueObject.create('12ABC34501DE35');
    expect(result).toBeInstanceOf(CnpjValueObject);
  });

  it('should reject repeated sequence CNPJ', () => {
    const result = CnpjValueObject.create('11.111.111/1111-11');
    expect(result).toBeInstanceOf(AbstractError);
  });

  it('should reject CNPJ with wrong verifier digits', () => {
    const result = CnpjValueObject.create('12.ABC.345/01DE-99');
    expect(result).toBeInstanceOf(AbstractError);
  });

  it('should reject CNPJ with incorrect length', () => {
    const result = CnpjValueObject.create('123');
    expect(result).toBeInstanceOf(AbstractError);
  });

  it('should return the same value via getValue', () => {
    const result = CnpjValueObject.create(
      '11.222.333/0001-81',
    ) as CnpjValueObject;
    expect(result.getValue()).toBe('11222333000181');
  });

  it('should strip mask and preserve letters in getStripped', () => {
    const result = CnpjValueObject.create(
      '12.ABC.345/01DE-35',
    ) as CnpjValueObject;
    expect(result.getStripped()).toBe('12ABC34501DE35');
  });
});
