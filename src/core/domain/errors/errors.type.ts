import { AlreadyExistsError } from './already-exists.error';
import { NotFoundError } from './not-found.error';
import { InternalError } from './internal.error';
import { InvalidDataError } from './invalid-data.error';
import { ValidationError } from './validation.error';
import { ProcessingError } from './processing.error';
import { DependencyError } from '@core/domain/errors/dependency.error';

export const ERRORS = {
  notFound: NotFoundError,
  AlreadyExists: AlreadyExistsError,
  Dependency: DependencyError,
  Internal: InternalError,
  InvalidData: InvalidDataError,
  Validation: ValidationError,
  Processing: ProcessingError,
};
export type ErrorsType = keyof typeof ERRORS;
