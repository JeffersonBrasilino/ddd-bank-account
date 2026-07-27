import { AbstractError } from './abstract-error';
import { ERROR_CODES } from './error-codes';

export class InternalError extends AbstractError<
  string | Array<string> | Partial<any>
> {
  constructor(
    errorOrMessage: string | Array<string> | Partial<any>,
    code?: string,
    previousError?: AbstractError<any>,
  ) {
    super(
      errorOrMessage,
      code ?? ERROR_CODES.INTERNAL_SERVER_ERROR,
      previousError,
    );
  }
}
