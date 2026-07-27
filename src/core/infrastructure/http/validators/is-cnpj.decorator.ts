import { ValidationOptions, registerDecorator } from 'class-validator';
import { cnpj } from 'cpf-cnpj-validator';

export function IsCNPJ(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isCNPJ',
      target: object.constructor,
      propertyName,
      options: { message: 'CNPJ inválido', ...validationOptions },
      validator: {
        validate(value: any) {
          return typeof value === 'string' && cnpj.isValid(value);
        },
      },
    });
  };
}
