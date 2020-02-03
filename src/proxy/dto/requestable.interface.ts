import { AxiosRequestConfig, AxiosResponse } from 'axios';

export interface RequestService {
  request<T>(config: AxiosRequestConfig, ...args: any[]): Promise<AxiosResponse<T>>;
}
