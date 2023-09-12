import { AbstractError } from '@core/domain/errors';

export class Result<T> {
  public constructor(
    private success: boolean,
    private error?: any,
    private value?: any,
  ) {
    Object.freeze(this);
  }

  public getValue(): T {
    return this.value;
  }

  public getError(): T | string | string[] {
    return this.error;
  }
  public static success<U>(value?: U): Result<U> {
    return new Result<U>(true, null, value);
  }

  public static failure<U>(error: string | U): Result<U> {
    return new Result<U>(false, error);
  }

  public isSuccess(): boolean {
    return this.success;
  }

  public isFailure(): boolean {
    return !this.success;
  }

  public static combine(...results: Array<AbstractError<any>>): Result<any> {
    const errors = [];
    const instanceErrors = ['AbstractError'];
    for (const result of results) {
      const parentErrorClasss = Object.getPrototypeOf(result.constructor).name;
      if (instanceErrors.indexOf(parentErrorClasss) != -1) {
        errors.push(result);
      }
    }
    return errors.length > 0 ? Result.failure(errors) : Result.success();
  }
}
