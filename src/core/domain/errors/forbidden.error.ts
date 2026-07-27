import { AbstractError } from './abstract-error';
import { ERROR_CODES } from './error-codes';

export class ForbiddenError extends AbstractError<
  string | Array<string> | Partial<any>
> {
  constructor(
    errorOrMessage: string | Array<string> | Partial<any>,
    code?: string,
  ) {
    super(errorOrMessage, code ?? ERROR_CODES.FORBIDDEN);
  }
}
