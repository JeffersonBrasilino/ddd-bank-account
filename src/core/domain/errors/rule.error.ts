import { AbstractError } from './abstract-error';
import { ERROR_CODES } from './error-codes';

export class RuleError extends AbstractError<
  string | Array<string> | Partial<any>
> {
  constructor(
    errorOrMessage: string | Array<string> | Partial<any>,
    code?: string,
  ) {
    super(errorOrMessage, code ?? ERROR_CODES.RULE_VIOLATION);
  }
}
