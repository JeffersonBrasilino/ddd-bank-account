export interface HttpClientResponseProps<TResponse> {
  status: number | string;
  data?: TResponse | undefined;
}

export interface HttpClientHeaders {
  [key: string]: string;
}

export interface HttpClientInterface {
  get<TResponse>(
    uri: string,
    headers?: HttpClientHeaders,
  ): Promise<HttpClientResponseProps<TResponse>>;
  post<TResponse>(
    uri: string,
    data: object,
    headers?: HttpClientHeaders,
  ): Promise<HttpClientResponseProps<TResponse>>;
  put<TResponse>(
    uri: string,
    data: object,
    headers?: HttpClientHeaders,
  ): Promise<HttpClientResponseProps<TResponse>>;
  remove<TResponse>(
    uri: string,
    headers?: HttpClientHeaders,
  ): Promise<HttpClientResponseProps<TResponse>>;
  patch<TResponse>(
    uri: string,
    data: object,
    headers?: HttpClientHeaders,
  ): Promise<HttpClientResponseProps<TResponse>>;
}
