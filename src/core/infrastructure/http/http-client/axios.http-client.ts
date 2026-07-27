import axios, { AxiosInstance } from 'axios';
import {
  HttpClientHeaders,
  HttpClientInterface,
  HttpClientResponseProps,
} from './http-client.interface';

export class AxiosHttpClient implements HttpClientInterface {
  protected axiosInstance: AxiosInstance;
  constructor(private baseUrl: string) {
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
    });
  }

  private async request<TResponse>(
    action: string,
    uri: string,
    data?: object,
    headers?: HttpClientHeaders,
  ): Promise<HttpClientResponseProps<TResponse>> {
    try {
      const config = headers ? { headers } : {};
      const response = await this.axiosInstance[action](uri, data, config);
      return {
        status: response.status,
        data: response.data as TResponse,
      } as HttpClientResponseProps<TResponse>;
    } catch (error: any) {
      throw {
        status: error?.response?.status ?? 500,
        data: error?.response?.data ?? 'Internal Error',
      } as HttpClientResponseProps<TResponse>;
    }
  }

  async get<TResponse>(
    uri: string,
    headers?: HttpClientHeaders,
  ): Promise<HttpClientResponseProps<TResponse>> {
    return await this.request('get', uri, undefined, headers);
  }

  async post<TResponse>(
    uri: string,
    data: object,
    headers?: HttpClientHeaders,
  ): Promise<HttpClientResponseProps<TResponse>> {
    return await this.request('post', uri, data, headers);
  }

  async put<TResponse>(
    uri: string,
    data: object,
    headers?: HttpClientHeaders,
  ): Promise<HttpClientResponseProps<TResponse>> {
    return await this.request('put', uri, data, headers);
  }

  async remove<TResponse>(
    uri: string,
    headers?: HttpClientHeaders,
  ): Promise<HttpClientResponseProps<TResponse>> {
    return await this.request('delete', uri, undefined, headers);
  }

  async patch<TResponse>(
    uri: string,
    data: object,
    headers?: HttpClientHeaders,
  ): Promise<HttpClientResponseProps<TResponse>> {
    return await this.request('patch', uri, data, headers);
  }
}
