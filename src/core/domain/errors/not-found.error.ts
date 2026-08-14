import { AbstractError } from './abstract-error';
import { ERROR_CODES } from './error-codes';

export class NotFoundError extends AbstractError<string | Array<string>> {
  constructor(errorOrMessage: string | Array<string>, code?: string) {
    super(errorOrMessage, code ?? ERROR_CODES.NOT_FOUND);
  }
}
