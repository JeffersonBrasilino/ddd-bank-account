import { AbstractError } from './abstract-error';
import { ERROR_CODES } from './error-codes';

export class ProcessingError extends AbstractError<
  string | Array<string> | Partial<any>
> {
  constructor(
    errorOrMessage: string | Array<string> | Partial<any>,
    code?: string,
    previousError?: AbstractError<any>,
  ) {
    super(errorOrMessage, code ?? ERROR_CODES.PROCESSING_ERROR, previousError);
  }
}
