import { serializeError } from './error-serializer';

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
  FORBIDDEN_CODE = 'FORBIDDEN',
  UNAUTHORIZED_CODE = 'UNAUTHORIZED',
  INTERNAL_SERVER_ERROR_CODE = 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  UNPROCESSABLE_ENTITY = 'UNPROCESSABLE_ENTITY',
  FAILED_DEPENDENCY = 'FAILED_DEPENDENCY',
}
export class HttpResponse {
  private static jsonResponse<TResponse>(
    isSuccess: boolean,
    status: string,
    dataOrMesage?: any,
  ): HttpResponseProps<TResponse> {
    return { status: status, data: dataOrMesage };
  }

  private static formatErrorMessage(error: any) {
    return serializeError(error);
  }

  static ok<TResponse>(data: any): HttpResponseProps<TResponse> {
    return HttpResponse.jsonResponse(true, httpStatusCodes.OK_CODE, data);
  }

  static created<TResponse>(data?: any): HttpResponseProps<TResponse> {
    return HttpResponse.jsonResponse(true, httpStatusCodes.CREATED_CODE, data);
  }

  static noContent<TResponse>(): HttpResponseProps<TResponse> {
    return HttpResponse.jsonResponse(true, httpStatusCodes.NO_CONTENT);
  }

  static notFound<TResponse>(data: any): HttpResponseProps<TResponse> {
    return HttpResponse.jsonResponse(
      false,
      httpStatusCodes.NOT_FOUND_CODE,
      HttpResponse.formatErrorMessage(data),
    );
  }

  static badRequest<TResponse>(data: any): HttpResponseProps<TResponse> {
    return HttpResponse.jsonResponse(
      false,
      httpStatusCodes.BAD_REQUEST_CODE,
      HttpResponse.formatErrorMessage(data),
    );
  }

  static serviceUnavailable<TResponse>(
    data: any,
  ): HttpResponseProps<TResponse> {
    return HttpResponse.jsonResponse(
      false,
      httpStatusCodes.SERVICE_UNAVAILABLE,
      HttpResponse.formatErrorMessage(data),
    );
  }

  static forbidden<TResponse>(data: any): HttpResponseProps<TResponse> {
    return HttpResponse.jsonResponse(
      false,
      httpStatusCodes.FORBIDDEN_CODE,
      HttpResponse.formatErrorMessage(data),
    );
  }

  static unauthorized<TResponse>(data: any): HttpResponseProps<TResponse> {
    return HttpResponse.jsonResponse(
      false,
      httpStatusCodes.UNAUTHORIZED_CODE,
      HttpResponse.formatErrorMessage(data),
    );
  }

  static conflict<TResponse>(data: any): HttpResponseProps<TResponse> {
    return HttpResponse.jsonResponse(
      false,
      httpStatusCodes.CONFLICT_CODE,
      HttpResponse.formatErrorMessage(data),
    );
  }

  static internalServerError<TResponse>(
    data: any,
  ): HttpResponseProps<TResponse> {
    return HttpResponse.jsonResponse(
      false,
      httpStatusCodes.INTERNAL_SERVER_ERROR_CODE,
      HttpResponse.formatErrorMessage(data),
    );
  }

  static unprocessableEntityError<TResponse>(
    data: any,
  ): HttpResponseProps<TResponse> {
    return HttpResponse.jsonResponse(
      false,
      httpStatusCodes.UNPROCESSABLE_ENTITY,
      HttpResponse.formatErrorMessage(data),
    );
  }

  static failedDependency<TResponse>(data: any): HttpResponseProps<TResponse> {
    return HttpResponse.jsonResponse(
      false,
      httpStatusCodes.FAILED_DEPENDENCY,
      HttpResponse.formatErrorMessage(data),
    );
  }
}
