export type ErrorMessageArg = string | string[] | Partial<any>;

export abstract class AbstractError<TError> {
  constructor(
    private errorOrMessage: TError,
    private code?: string,
    private previousError?: AbstractError<any>,
  ) {}

  getError(): TError {
    return this.errorOrMessage;
  }

  getCode(): string | undefined {
    return this.code;
  }

  getCodeAsString(): string {
    if (this.code === undefined || this.code === null) {
      return '';
    }
    return String(this.code);
  }

  getPreviousError(): AbstractError<any> {
    return this.previousError;
  }
}