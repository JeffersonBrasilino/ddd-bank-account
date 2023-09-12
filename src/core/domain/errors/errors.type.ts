import { ConflictError } from './conflict.error';
import { DependencyError } from './dependency.error';
import { NotFoundError } from './not-found.error';
import { InternalError } from './internal.error';
import { InvalidDataError } from './invalid-data.error';
import { ValidationError } from './validation.error';

export const ERRORS = {
  notFound: NotFoundError,
  conflict: ConflictError,
  DependencyError: DependencyError,
  InternalError: InternalError,
  InvalidData: InvalidDataError,
  Validation: ValidationError,
};
export type ErrorsType = keyof typeof ERRORS;
