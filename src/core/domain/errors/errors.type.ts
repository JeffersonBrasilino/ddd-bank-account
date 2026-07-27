import { AlreadyExistsError } from './already-exists.error';
import { DependencyError } from './dependency.error';
import { ForbiddenError } from './forbidden.error';
import { InternalError } from './internal.error';
import { InvalidDataError } from './invalid-data.error';
import { NotFoundError } from './not-found.error';
import { ProcessingError } from './processing.error';
import { RuleError } from './rule.error';
import { UnauthorizedError } from './unauthorized.error';
import { ValidationError } from './validation.error';

export const ERRORS = {
  NotFound: NotFoundError,
  AlreadyExists: AlreadyExistsError,
  Dependency: DependencyError,
  Internal: InternalError,
  InvalidData: InvalidDataError,
  Validation: ValidationError,
  Processing: ProcessingError,
  Rule: RuleError,
  Unauthorized: UnauthorizedError,
  Forbidden: ForbiddenError,
};
export type ErrorsType = keyof typeof ERRORS;
