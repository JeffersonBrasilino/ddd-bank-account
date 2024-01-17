import { ERRORS, ErrorsType } from './errors.type';
import { AbstractError } from '@core/domain/errors';

export class ErrorFactory {
  private map: Map<ErrorsType, AbstractError<any>> = new Map();

  private static classInstance?: ErrorFactory = null;
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
    ...props: any
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
