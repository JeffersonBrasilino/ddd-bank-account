import { AbstractError } from '@core/domain/errors';
import {
  ERROR_FALLBACK,
  serializeError,
} from '@core/infrastructure/http/error-serializer';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpErrorFilter.name);

  private extractHttpExceptionPayload(exceptionResponse: unknown): unknown {
    if (exceptionResponse && typeof exceptionResponse === 'object') {
      if ('data' in exceptionResponse) {
        return (exceptionResponse as any).data;
      }
      if ('message' in exceptionResponse) {
        return exceptionResponse;
      }
    }
    return exceptionResponse;
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const payload = this.extractHttpExceptionPayload(exception.getResponse());
      response.status(status).json(serializeError(payload));
      return;
    }

    if (exception instanceof AbstractError) {
      const serialized = serializeError(exception);
      this.logger.error(
        serialized.message,
        exception instanceof Error ? exception.stack : undefined,
      );
      response.status(500).json(serialized);
      return;
    }

    if (exception instanceof Error) {
      this.logger.error(exception.message, exception.stack);
      response.status(500).json({ ...ERROR_FALLBACK });
      return;
    }

    this.logger.error('Unhandled exception', String(exception));
    response.status(500).json({ ...ERROR_FALLBACK });
  }
}
