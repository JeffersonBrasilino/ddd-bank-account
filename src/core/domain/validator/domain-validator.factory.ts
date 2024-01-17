import { DomainAttributeValidator } from './domain-attribute.validator';
import { DomainValidator } from './domain-validator';
import { DomainValidatorInterface } from './domain-validator.interface';

export type domainValidatorSchemaProps = {
  [key: string]: domainValidatorSchemaProps | Array<DomainValidatorInterface>;
};

export class DomainValidatorFactory {
  private constructor() {}

  static create(schema: domainValidatorSchemaProps): DomainValidator {
    return new DomainValidatorFactory().mountValidator(schema);
  }

  mountValidator(schema: domainValidatorSchemaProps): DomainValidator {
    const domainValidatorInstance: DomainValidator = new DomainValidator();
    for (const attribute in schema) {
      if (schema[attribute].constructor.name === 'Object') {
        const collectionValidator = this.mountValidator(
          schema[attribute] as domainValidatorSchemaProps,
        );
        domainValidatorInstance.addAttribute(attribute, collectionValidator);
      } else {
        domainValidatorInstance.addAttribute(
          attribute,
          new DomainAttributeValidator(
            ...(schema[attribute] as DomainValidatorInterface[]),
          ),
        );
      }
    }
    return domainValidatorInstance;
  }
}
