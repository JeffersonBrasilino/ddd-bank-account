import { ValueObject } from '@core/domain';
import { CryptPasswordInterface } from './contracts/crypt-password.interface';
import { AbstractError, ErrorFactory } from '@core/domain/errors';
import {
  DomainValidatorFactory,
  domainValidatorSchemaProps,
} from '@core/domain/validator/domain-validator.factory';
import { RequiredValidator } from '@core/domain/validator';
import { RegexValidator } from '@core/domain/validator/regex.validator';
import { ValidationError } from '@core/domain/errors/validation.error';

export type passwordValueObjectProps = {
  value: string;
  alreadyValidated?: boolean;
};
export class PasswordValueObject extends ValueObject {
  private constructor(private props: passwordValueObjectProps) {
    super();
  }

  private static validate(
    value: passwordValueObjectProps,
  ): boolean | ValidationError {
    const validateProps: domainValidatorSchemaProps = {
      value: [
        new RequiredValidator(),
        new RegexValidator(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        ).withErrorMessage(
          `the password must contain: an uppercase letter, a number, a special character and a minimum length of 8 characters`,
        ),
      ],
    };
    const validation = DomainValidatorFactory.create(validateProps);
    if (validation.validate(value) == false) {
      return ErrorFactory.create('Validation', validation.getErrors());
    }
    return true;
  }

  static create(
    props: passwordValueObjectProps,
  ): PasswordValueObject | AbstractError<any> {
    if (!props.alreadyValidated) {
      const valid = this.validate(props);
      if (valid instanceof ValidationError) return valid;
    }

    return new PasswordValueObject(props);
  }

  getValue(): string {
    return this.props.value;
  }

  crypt(cryptStrategy: CryptPasswordInterface): void {
    this.props.value = cryptStrategy.crypt(this.props.value);
  }
}
