import { InfrastructureError } from './infrastructure.error';

export class DependencyError extends InfrastructureError {
  constructor(errorOrMessage: string | string[] | Partial<any>) {
    super(errorOrMessage);
  }
}
