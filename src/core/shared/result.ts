/**
 * classe de result geral.
 * serve para padronizar os retornos entre camadas, havendo assim, uma unica estrutura entre ambas.
 */
export class Result<T> {
  /*   public isError: boolean;
  private error: T | string | string[];
  private _value: T; */

  public constructor(
    private success: boolean,
    private error?: any,
    private value?: any,
  ) {
    /*     if (isSuccess && error) {
      throw new Error('OperacaoInvalida: O resultado nao pode ser valido e invalido ao mesmo tempo.');
    }
    if (!isSuccess && !error) {
      throw new Error('OperacaoInvalida: O resultado deve ser valido ou invalido.');
    }

    this.isError = !isSuccess;
    this.error = error;
    this._value = value; */

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

  public static combine(results: Result<any>[]): Result<any> {
    const errors = [];
    for (const result of results) {
      if (result.isFailure) {
        errors.push({
          arrayPosition: results.indexOf(result),
          error: result.getError(),
        });
      }
    }
    return errors.length > 0 ? Result.failure(errors) : Result.success();
  }
}
