import { ValueObject } from '@core/domain';
import { AbstractError, ErrorFactory } from '@core/domain/errors';
import {
  DomainValidatorFactory,
  RequiredValidator,
} from '@core/domain/validator';
import { domainValidatorSchemaProps } from '@core/domain/validator/domain-validator.factory';
import { RegexValidator } from '@core/domain/validator/regex.validator';

export class EmailValueObject extends ValueObject {
  private constructor(readonly _value: string) {
    super();
  }

  private static validate(value: string): AbstractError<any> | null {
    const validateProps: domainValidatorSchemaProps = {
      value: [
        new RequiredValidator(),
        new RegexValidator(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        ),
      ],
    };
    const validation = DomainValidatorFactory.create(validateProps);
    if (validation.validate({ value }) == false) {
      return ErrorFactory.create('Validation', validation.getErrors());
    }
    return null;
  }

  static create(value: string): EmailValueObject | AbstractError<any> {
    const validation = EmailValueObject.validate(value);
    if (validation instanceof AbstractError) return validation;

    return new EmailValueObject(value);
  }

  value() {
    return this._value;
  }
}
