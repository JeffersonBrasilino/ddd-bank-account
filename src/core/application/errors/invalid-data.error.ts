import { ApplicationError } from './application.error';

export class InvalidDataError extends ApplicationError {
  constructor(errorOrMessage: string | string[]) {
    super(errorOrMessage);
  }
}
