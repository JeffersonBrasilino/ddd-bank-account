import { ApplicationError } from './application.error';

export class NotFoundError extends ApplicationError {
  constructor(errorOrMessage?) {
    super(errorOrMessage ?? 'Register not found.');
  }
}
