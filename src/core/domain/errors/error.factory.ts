import { AbstractError } from './abstract-error';
import { ERRORS, ErrorsType } from './errors.type';

export class ErrorFactory {
  private map: Map<ErrorsType, any> = new Map();

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
      this.map.set(err[0] as ErrorsType, err[1]);
    });
  }

  public exists(action: ErrorsType): boolean {
    return this.map.has(action);
  }

  public create(type: ErrorsType, props?: any): AbstractError<ErrorsType> {
    if (!this.exists(type)) {
      throw new Error(`There is no error for this type ${type}`);
    }

    const errorInstance = this.map.get(type);

    return new errorInstance(props);
  }

  public getActions() {
    return this.map.entries();
  }
}
