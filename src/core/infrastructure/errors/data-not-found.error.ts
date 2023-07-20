import { InfrastructureError } from './infrastructure.error';

export class DataNotFoundError extends InfrastructureError {
  constructor(errorOrMessage: string | string[] | Partial<any>) {
    super(errorOrMessage);
  }
}
