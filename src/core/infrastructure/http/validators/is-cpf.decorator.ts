import { ValidationOptions, registerDecorator } from 'class-validator';
import { cpf } from 'cpf-cnpj-validator';

export function IsCPF(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isCPF',
      target: object.constructor,
      propertyName,
      options: { message: 'CPF inválido', ...validationOptions },
      validator: {
        validate(value: any) {
          return typeof value === 'string' && cpf.isValid(value);
        },
      },
    });
  };
}
