export class Result<T> {
  public isSuccess: boolean;
  private error: T | string;
  private _value: T;

  public constructor(isSuccess: boolean, error?: T | string, value?: T) {
    if (isSuccess && error) {
      throw new Error(
        'OperacaoInvalida: O resultado nao pode ser valido e invalido ao mesmo tempo.',
      );
    }
    if (!isSuccess && !error) {
      throw new Error(
        'OperacaoInvalida: O resultado deve ser valido ou invalido.',
      );
    }

    this.isSuccess = isSuccess;
    this.error = error;
    this._value = value;

    Object.freeze(this);
  }

  public getValue(): T {
    if (!this.isSuccess) {
      throw new Error('O valor invalido e retornado na funcao errorValue');
    }

    return this._value;
  }

  public getError(): T {
    return this.error as T;
  }

  public static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, null, value);
  }

  public static fail<U>(error: string): Result<U> {
    return new Result<U>(false, error);
  }

  public static combine(results: Result<any>[]): Result<any> {
    for (const result of results) {
      if (!result.isSuccess) return result;
    }
    return Result.ok();
  }
}
