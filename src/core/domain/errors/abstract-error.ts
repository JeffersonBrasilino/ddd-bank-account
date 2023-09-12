export abstract class AbstractError<TError> {
  constructor(
    private errorOrMessage: TError,
    private code?: number,
    private previousError?: AbstractError<any>,
  ) {}

  getError(): TError {
    return this.errorOrMessage;
  }

  getCode(): number {
    return this.code;
  }

  getPreviousError(): AbstractError<any> {
    return this.previousError;
  }
}
