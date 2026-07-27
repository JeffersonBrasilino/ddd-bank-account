import { AbstractError, ErrorMessageArg } from './abstract-error';
import { ERRORS, ErrorsType } from './errors.type';

export class ErrorFactory {
  private map: Map<ErrorsType, AbstractError<any>> = new Map();

  private static classInstance: ErrorFactory | null = null;
  private constructor() {
    this.register();
  }

  static instance() {
    if (ErrorFactory.classInstance == null)
      ErrorFactory.classInstance = new ErrorFactory();

    return ErrorFactory.classInstance;
  }

  public register(): void {
    Object.entries(ERRORS).map(err => {
      this.map.set(
        err[0] as ErrorsType,
        err[1] as unknown as AbstractError<any>,
      );
    });
  }

  public exists(action: ErrorsType): boolean {
    return this.map.has(action);
  }

  public static create(
    type: ErrorsType,
    errorOrMessage: ErrorMessageArg,
  ): AbstractError<ErrorsType>;
  public static create(
    type: ErrorsType,
    errorOrMessage: ErrorMessageArg,
    code: string,
  ): AbstractError<ErrorsType>;
  public static create(
    type: ErrorsType,
    errorOrMessage: ErrorMessageArg,
    code: string,
    previousError: AbstractError<any>,
  ): AbstractError<ErrorsType>;
  public static create(
    type: ErrorsType,
    ...props: unknown[]
  ): AbstractError<ErrorsType>;
  public static create(
    type: ErrorsType,
    ...props: unknown[]
  ): AbstractError<ErrorsType> {
    const errorFactoryInstance = ErrorFactory.instance();

    const errorInstance = errorFactoryInstance.getErrorByType(type) as any;

    return new errorInstance(...props);
  }

  public getErrorByType(type: ErrorsType): AbstractError<any> {
    if (!this.exists(type)) {
      throw new Error(`There is no error for this type ${type}`);
    }

    return this.map.get(type);
  }

  public getErrors() {
    return this.map.entries();
  }
}