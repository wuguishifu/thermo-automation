import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import axiosRetry, { isNetworkOrIdempotentRequestError, isRetryableError } from 'axios-retry';

import { authenticationService } from '@/server/authenticationService';

class HttpService {
  private readonly instance: AxiosInstance;

  constructor() {
    const axiosConfig: AxiosRequestConfig = {
      timeout: 5000,
      baseURL: 'https://integrator-api.daikinskyport.com/v1/',
      headers: {
        'x-api-key': process.env.DAIKIN_API_KEY || '',
      },
    };

    this.instance = axios.create(axiosConfig);
    axiosRetry(this.instance, {
      retries: 3,
      shouldResetTimeout: true,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: (error) =>
        isNetworkOrIdempotentRequestError(error) || isRetryableError(error) || error.code === 'ECONNABORTED',
    });
  }

  public get = async <Response>(url: string, config?: AxiosRequestConfig) => {
    console.log('GET', url);
    const refreshToken = await authenticationService.getAuthenticationToken();
    return this.instance.get<Response>(url, {
      ...config,
      headers: {
        ...config?.headers,
        Authorization: `Bearer ${refreshToken}`,
      },
    });
  };

  public post = async <Response, Data>(url: string, data?: Data, config?: AxiosRequestConfig) => {
    console.log('POST', url, data);
    const refreshToken = await authenticationService.getAuthenticationToken();
    return this.instance.post<Response>(url, data, {
      ...config,
      headers: {
        ...config?.headers,
        Authorization: `Bearer ${refreshToken}`,
      },
    });
  };

  public put = async <Response, Data>(url: string, data?: Data, config?: AxiosRequestConfig) => {
    console.log('PUT', url, data);
    const refreshToken = await authenticationService.getAuthenticationToken();
    return this.instance.put<Response>(url, data, {
      ...config,
      headers: {
        ...config?.headers,
        Authorization: `Bearer ${refreshToken}`,
      },
    });
  };

  public patch = async <Response, Data>(url: string, data?: Data, config?: AxiosRequestConfig) => {
    console.log('PATCH', url, data);
    const refreshToken = await authenticationService.getAuthenticationToken();
    return this.instance.patch<Response>(url, data, {
      ...config,
      headers: {
        ...config?.headers,
        Authorization: `Bearer ${refreshToken}`,
      },
    });
  };

  public delete = async <Response>(url: string, config?: AxiosRequestConfig) => {
    console.log('DELETE', url);
    const refreshToken = await authenticationService.getAuthenticationToken();
    return this.instance.delete<Response>(url, {
      ...config,
      headers: {
        ...config?.headers,
        Authorization: `Bearer ${refreshToken}`,
      },
    });
  };
}

export const httpService = new HttpService();
