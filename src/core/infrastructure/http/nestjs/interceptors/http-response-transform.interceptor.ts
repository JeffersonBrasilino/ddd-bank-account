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
        if (data == undefined || !HttpStatus[data.status])
          throw new Error('http status code invalido.');
        if (HttpStatus[data.status].toString().match(/^5/))
          throw new HttpException(data, HttpStatus[data.status]);

        const response = context.switchToHttp().getResponse();
        response.status(HttpStatus[data.status]);
        response.type('json');
        return JSON.stringify(data?.data) ?? undefined;
      }),
    );
  }
}
