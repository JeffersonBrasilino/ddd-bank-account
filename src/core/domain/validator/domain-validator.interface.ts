export interface DomainValidatorInterface {
  validate(field): boolean;
  getErrors();
}
