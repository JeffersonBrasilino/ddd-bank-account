export type HttpResponseProps<TResponse = any> = {
  status: string | number;
  data: TResponse;
};
export enum httpStatusCodes {
  OK_CODE = 'OK',
  CONFLICT_CODE = 'CONFLICT',
  CREATED_CODE = 'CREATED',
  NO_CONTENT = 'NO_CONTENT',
  BAD_REQUEST_CODE = 'BAD_REQUEST',
  NOT_FOUND_CODE = 'NOT_FOUND',
  FORBIDEN_CODE = 'FORBIDDEN',
  UNAUTORIZED_CODE = 'UNAUTHORIZED',
  INTERNAL_SERVER_ERROR_CODE = 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  UNPROCESSABLE_ENTITY = 'UNPROCESSABLE_ENTITY',
}
export class HttpResponse {
  private static jsonResponse<TResponse>(
    isSuccess: boolean,
    status: string,
    dataOrMesage?: any,
  ): HttpResponseProps<TResponse> {
    return { status: status, data: dataOrMesage };
  }

  static ok<TResponse>(data: any): HttpResponseProps<TResponse> {
    return HttpResponse.jsonResponse(true, httpStatusCodes.OK_CODE, data);
  }

  static created<TResponse>(): HttpResponseProps<TResponse> {
    return HttpResponse.jsonResponse(true, httpStatusCodes.CREATED_CODE);
  }

  static noContent<TResponse>(): HttpResponseProps<TResponse> {
    return HttpResponse.jsonResponse(true, httpStatusCodes.NO_CONTENT);
  }

  static notFound<TResponse>(data: any): HttpResponseProps<TResponse> {
    return HttpResponse.jsonResponse(
      false,
      httpStatusCodes.NOT_FOUND_CODE,
      data,
    );
  }

  static badRequest<TResponse>(data: any): HttpResponseProps<TResponse> {
    return HttpResponse.jsonResponse(
      false,
      httpStatusCodes.BAD_REQUEST_CODE,
      data,
    );
  }

  static serviceUnavailable<TResponse>(
    data: any,
  ): HttpResponseProps<TResponse> {
    return HttpResponse.jsonResponse(
      false,
      httpStatusCodes.SERVICE_UNAVAILABLE,
      data,
    );
  }

  static forbidden<TResponse>(data: any): HttpResponseProps<TResponse> {
    return HttpResponse.jsonResponse(
      false,
      httpStatusCodes.FORBIDEN_CODE,
      data,
    );
  }

  static unautorized<TResponse>(data: any): HttpResponseProps<TResponse> {
    return HttpResponse.jsonResponse(
      false,
      httpStatusCodes.UNAUTORIZED_CODE,
      data,
    );
  }

  static conflict<TResponse>(data: any): HttpResponseProps<TResponse> {
    return HttpResponse.jsonResponse(
      false,
      httpStatusCodes.CONFLICT_CODE,
      data,
    );
  }

  static internalServerError<TResponse>(
    data: any,
  ): HttpResponseProps<TResponse> {
    return HttpResponse.jsonResponse(
      false,
      httpStatusCodes.INTERNAL_SERVER_ERROR_CODE,
      data,
    );
  }

  static unprocessableEntityError<TResponse>(
    data: any,
  ): HttpResponseProps<TResponse> {
    return HttpResponse.jsonResponse(
      false,
      httpStatusCodes.UNPROCESSABLE_ENTITY,
      data,
    );
  }
}
