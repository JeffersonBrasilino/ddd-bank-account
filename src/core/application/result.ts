import { AbstractError } from '@core/domain/errors';

export class Result<T> {
  public constructor(
    private success: boolean,
    private error?: AbstractError<any>,
    private value?: T,
  ) {
    Object.freeze(this);
  }

  public getValue(): T {
    return this.value;
  }

  public getError(): AbstractError<any> {
    return this.error;
  }

  public static success<U>(value?: U): Result<U> {
    return new Result<U>(true, null, value);
  }

  public static failure<U>(error: AbstractError<any>): Result<U> {
    return new Result<U>(false, error);
  }

  public isSuccess(): boolean {
    return this.success;
  }

  public isFailure(): boolean {
    return !this.success;
  }
}
