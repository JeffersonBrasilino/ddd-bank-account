import { AbstractError } from '@core/domain/errors';
import { ProcessingError } from '@core/domain/errors';
import { AlreadyExistsError } from '@core/domain/errors/already-exists.error';
import { DependencyError } from '@core/domain/errors/dependency.error';
import { ForbiddenError } from '@core/domain/errors/forbidden.error';
import { InternalError } from '@core/domain/errors/internal.error';
import { InvalidDataError } from '@core/domain/errors/invalid-data.error';
import { NotFoundError } from '@core/domain/errors/not-found.error';
import { RuleError } from '@core/domain/errors/rule.error';
import { UnauthorizedError } from '@core/domain/errors/unauthorized.error';
import { ValidationError } from '@core/domain/errors/validation.error';
import { HttpResponse, HttpResponseProps } from './http-response';

type ErrorClass = new (...args: any[]) => AbstractError<any>;

export abstract class AbstractController {
  protected processError(
    errorResult: AbstractError<any>,
  ): HttpResponseProps {
    const notFoundErrors: ErrorClass[] = [NotFoundError];
    const badRequestErrors: ErrorClass[] = [ValidationError, InvalidDataError];
    const AlreadyExistsErrors: ErrorClass[] = [AlreadyExistsError];
    const failedDependencyErrors: ErrorClass[] = [DependencyError];
    const unprocessableEntityErrors: ErrorClass[] = [ProcessingError];
    const internalError: ErrorClass[] = [InternalError];
    const ruleErrors: ErrorClass[] = [RuleError];
    const unauthorizedErrors: ErrorClass[] = [UnauthorizedError];
    const forbiddenErrors: ErrorClass[] = [ForbiddenError];
    const ctor: ErrorClass = errorResult.constructor as ErrorClass;

    if (unauthorizedErrors.includes(ctor)) {
      return HttpResponse.unauthorized(errorResult);
    }

    if (forbiddenErrors.includes(ctor)) {
      return HttpResponse.forbidden(errorResult);
    }

    if (AlreadyExistsErrors.includes(ctor)) {
      return HttpResponse.conflict(errorResult);
    }

    if (failedDependencyErrors.includes(ctor)) {
      return HttpResponse.failedDependency(errorResult);
    }

    if (badRequestErrors.includes(ctor)) {
      return HttpResponse.badRequest(errorResult);
    }

    if (unprocessableEntityErrors.includes(ctor)) {
      return HttpResponse.unprocessableEntityError(errorResult);
    }

    if (notFoundErrors.includes(ctor)) {
      return HttpResponse.notFound(errorResult);
    }

    if (internalError.includes(ctor)) {
      return HttpResponse.internalServerError(errorResult);
    }
    if (ruleErrors.includes(ctor)) {
      return HttpResponse.badRequest(errorResult);
    }

    return HttpResponse.internalServerError(errorResult);
  }
}