import { DomainError } from './domain.error';

export class DomainValidationError extends DomainError {
  constructor(errorOrMessage: string | Array<string>) {
    super(errorOrMessage);
  }
}
