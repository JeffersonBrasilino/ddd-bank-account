import { ValidationError } from '@core/domain/errors/validation.error';
import { HttpResponse, HttpResponseProps } from './http-response';
import { NotFoundError } from '@core/domain/errors/not-found.error';
import { InvalidDataError } from '@core/domain/errors/invalid-data.error';
import { ConflictError } from '@core/domain/errors/conflict.error';
import { DependencyError } from '@core/domain/errors/dependency.error';
import { InternalError } from '@core/domain/errors/internal.error';

export abstract class AbstractController {
  protected processError(errorResult): HttpResponseProps {
    const notFoundErrors = [NotFoundError];
    const badRequestErrors = [ValidationError, InvalidDataError];
    const conflictErrors = [ConflictError];
    const serviceUnavailableErrors = [DependencyError];
    const unprocessableEntityErrors = [DependencyError];
    const internalError = [InternalError];

    if (conflictErrors.includes(errorResult.constructor)) {
      return HttpResponse.conflict(errorResult.getError());
    }

    if (serviceUnavailableErrors.includes(errorResult.constructor)) {
      return HttpResponse.serviceUnavailable(errorResult.getError());
    }

    if (badRequestErrors.includes(errorResult.constructor)) {
      return HttpResponse.badRequest(errorResult.getError());
    }

    if (unprocessableEntityErrors.includes(errorResult.constructor)) {
      return HttpResponse.unprocessableEntityError(errorResult.getError());
    }

    if (notFoundErrors.includes(errorResult.constructor)) {
      return HttpResponse.notFound(errorResult.getError());
    }

    if (internalError.includes(errorResult.constructor)) {
      return HttpResponse.internalServerError(
        'error during processing the request',
      );
    }
  }
}
