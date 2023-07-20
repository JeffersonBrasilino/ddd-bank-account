import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
  HttpException,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { HttpResponseProps } from '@core/infrastructure/http/http-response';

@Injectable()
export class HttpResponseTransformInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data: HttpResponseProps) => {
        const { status } = data;
        if (!HttpStatus[status]) throw new Error('http status code invalido.');
        if (HttpStatus[status].toString().match(/^5/))
          throw new HttpException(data, HttpStatus[status]);
        delete data.status;

        if (['NO_CONTENT'].indexOf(status as string) != -1) {
          context.switchToHttp().getResponse().status(HttpStatus[status]);
          return;
        }
        context
          .switchToHttp()
          .getResponse()
          .status(HttpStatus[status])
          .json(data.data);
      }),
    );
  }
}
