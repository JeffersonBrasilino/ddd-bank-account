export interface HttpClientResponseProps<TResponse> {
  status: number | string;
  data?: TResponse | undefined;
}

export interface HttpClientInterface {
  get<TResponse>(uri: string): Promise<HttpClientResponseProps<TResponse>>;
  post<TResponse>(
    uri: string,
    data: object,
  ): Promise<HttpClientResponseProps<TResponse>>;
  put<TResponse>(
    uri: string,
    data: object,
  ): Promise<HttpClientResponseProps<TResponse>>;
  remove<TResponse>(uri: string): Promise<HttpClientResponseProps<TResponse>>;
  patch<TResponse>(
    uri: string,
    data: object,
  ): Promise<HttpClientResponseProps<TResponse>>;
}
