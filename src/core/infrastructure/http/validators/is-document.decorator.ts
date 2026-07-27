import { ValidationOptions, registerDecorator } from 'class-validator';
import { cnpj, cpf } from 'cpf-cnpj-validator';

export function IsDocument(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isDocument',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === 'string' && (cnpj.isValid(value) || cpf.isValid(value));
        },
        defaultMessage() {
          return 'Documento inválido';
        },
      },
    });
  };
}
