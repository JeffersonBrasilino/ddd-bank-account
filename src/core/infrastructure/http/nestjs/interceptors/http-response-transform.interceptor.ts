import { HttpResponseProps } from '@core/infrastructure/http/http-response';
import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable()
export class HttpResponseTransformInterceptor implements NestInterceptor {
  private getHttpStatusCode(status: string | number): number {
    const statusMap = {
      OK: HttpStatus.OK,
      ok: HttpStatus.OK,
      CREATED: HttpStatus.CREATED,
      NO_CONTENT: HttpStatus.NO_CONTENT,
      BAD_REQUEST: HttpStatus.BAD_REQUEST,
      NOT_FOUND: HttpStatus.NOT_FOUND,
      FORBIDDEN: HttpStatus.FORBIDDEN,
      UNAUTHORIZED: HttpStatus.UNAUTHORIZED,
      INTERNAL_SERVER_ERROR: HttpStatus.INTERNAL_SERVER_ERROR,
      SERVICE_UNAVAILABLE: HttpStatus.SERVICE_UNAVAILABLE,
      UNPROCESSABLE_ENTITY: HttpStatus.UNPROCESSABLE_ENTITY,
      CONFLICT: HttpStatus.CONFLICT,
      FAILED_DEPENDENCY: HttpStatus.FAILED_DEPENDENCY,
    };

    if (typeof status === 'number') {
      return status;
    }

    const httpStatus = statusMap[status];
    if (!httpStatus) {
      throw new Error(`Invalid HTTP status code: ${status}`);
    }

    return httpStatus;
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data: HttpResponseProps) => {
        if (!data || !data.status) {
          throw new HttpException(
            {
              status: 'INTERNAL_SERVER_ERROR',
              data: {
                message: 'Invalid HTTP response: missing data or status.',
              },
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }

        const httpStatusCode = this.getHttpStatusCode(data.status);

        // Verifica se é um erro 5xx
        if (httpStatusCode >= 500) {
          throw new HttpException(data, httpStatusCode);
        }

        const response = context.switchToHttp().getResponse();
        response.status(httpStatusCode);
        if (httpStatusCode !== HttpStatus.NO_CONTENT) {
          response.type('json');
        }

        return data?.data ?? undefined;
      }),
      catchError(error => {
        // Se for um erro de status inválido, retorna erro 500
        if (
          error instanceof Error &&
          error.message.includes('Invalid HTTP status code')
        ) {
          return throwError(
            () =>
              new HttpException(
                {
                  status: 'INTERNAL_SERVER_ERROR',
                  data: { message: error.message },
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
              ),
          );
        }
        // Se já for um HttpException, re-throw
        if (error instanceof HttpException) {
          return throwError(() => error);
        }
        // Para outros erros, converter para HttpException 500
        return throwError(
          () =>
            new HttpException(
              {
                status: 'INTERNAL_SERVER_ERROR',
                data: {
                  message:
                    error instanceof Error
                      ? error.message
                      : 'Internal server error',
                },
              },
              HttpStatus.INTERNAL_SERVER_ERROR,
            ),
        );
      }),
    );
  }
}
