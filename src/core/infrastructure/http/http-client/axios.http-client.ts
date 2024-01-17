import axios, { AxiosInstance } from 'axios';
import {
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
  ): Promise<HttpClientResponseProps<TResponse>> {
    try {
      const response = await this.axiosInstance[action](uri, data);
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
  ): Promise<HttpClientResponseProps<TResponse>> {
    return await this.request('get', uri);
  }
  async post<TResponse>(
    uri: string,
    data: object,
  ): Promise<HttpClientResponseProps<TResponse>> {
    return await this.request('post', uri, data);
  }
  async put<TResponse>(
    uri: string,
    data: object,
  ): Promise<HttpClientResponseProps<TResponse>> {
    return await this.request('put', uri, data);
  }
  async remove<TResponse>(
    uri: string,
  ): Promise<HttpClientResponseProps<TResponse>> {
    return await this.request('delete', uri);
  }
  async patch<TResponse>(
    uri: string,
    data: object,
  ): Promise<HttpClientResponseProps<TResponse>> {
    return await this.request('patch', uri, data);
  }
}
