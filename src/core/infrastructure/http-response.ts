import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';
export interface ResponseReturnProps {
  status: number | string;
  data?: any;
  err?: any;
}
export class HttpResponse {
  private static readonly OK_CODE: string = 'OK';
  private static readonly CONFLICT_CODE: string = 'CONFLICT';
  private static readonly CREATED_CODE: string = 'CREATED';
  private static readonly BAD_REQUEST_CODE: string = 'BAD_REQUEST';
  private static readonly NOT_FOUND_CODE: string = 'NOT_FOUND';
  private static readonly FORBIDEN_CODE: string = 'FORBIDDEN';
  private static readonly UNAUTORIZED_CODE: string = 'UNAUTHORIZED';
  private static readonly INTERNAL_SERVER_ERROR_CODE: string =
    'INTERNAL_SERVER_ERROR';

  private static getHttpCode(codeString): number {
    return (HttpStatus[codeString] as unknown as number) ?? 200;
  }

  private static jsonResponse(
    isSuccess: boolean,
    status: string,
    response: Response,
    dataOrMessage?: any,
  ): Response {
    let res = { status: HttpResponse.getHttpCode(status) };
    if (isSuccess == true && dataOrMessage)
      res = { ...res, ...{ data: dataOrMessage } };
    else if (isSuccess == false && dataOrMessage)
      res = { ...res, ...{ err: dataOrMessage } };
    return response.status(res.status).json(res);
  }

  static ok(res: Response, data?: any): Response {
    return HttpResponse.jsonResponse(true, HttpResponse.OK_CODE, res, data);
  }

  static created(res: Response, data?: any): Response {
    return HttpResponse.jsonResponse(
      true,
      HttpResponse.CREATED_CODE,
      res,
      data,
    );
  }

  static notFound(res: Response, data?: any): Response {
    return HttpResponse.jsonResponse(
      false,
      HttpResponse.NOT_FOUND_CODE,
      res,
      data,
    );
  }

  static badRequest(res: Response, data?: any): Response {
    return HttpResponse.jsonResponse(
      false,
      HttpResponse.BAD_REQUEST_CODE,
      res,
      data,
    );
  }

  static forbidden(res: Response, data?: any): Response {
    return HttpResponse.jsonResponse(
      false,
      HttpResponse.FORBIDEN_CODE,
      res,
      data,
    );
  }

  static unauthorized(res: Response, data?: any): Response {
    return HttpResponse.jsonResponse(
      false,
      HttpResponse.UNAUTORIZED_CODE,
      res,
      data,
    );
  }

  static conflict(res: Response, data?: any): Response {
    return HttpResponse.jsonResponse(
      false,
      HttpResponse.CONFLICT_CODE,
      res,
      data,
    );
  }

  static internalServerError(res: Response, data?: any): Response {
    return HttpResponse.jsonResponse(
      false,
      HttpResponse.INTERNAL_SERVER_ERROR_CODE,
      res,
      data,
    );
  }
}
