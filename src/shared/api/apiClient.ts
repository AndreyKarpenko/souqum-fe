import axios, {
  AxiosError,
  getAdapter,
  type AxiosAdapter,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import { resolveDiscoverMock } from '@/shared/api/mock/discoverMock.ts';
import { resolveMessagesMock } from '@/shared/api/mock/messagesMock.ts';
import { resolveStoreMock } from '@/shared/api/mock/storeMock.ts';

const requestPath = (config: InternalAxiosRequestConfig) => {
  const url = config.url ?? '';
  if (/^https?:\/\//.test(url)) return new URL(url).pathname;

  const base =
    config.baseURL && /^https?:\/\//.test(config.baseURL) ? config.baseURL : 'http://localhost';
  return new URL(url, base.endsWith('/') ? base : `${base}/`).pathname;
};

let httpAdapter: AxiosAdapter | null = null;

const getHttpAdapter = () => {
  if (!httpAdapter) httpAdapter = getAdapter(axios.defaults.adapter);
  return httpAdapter;
};

const mockingAdapter: AxiosAdapter = async (config) => {
  const method = (config.method ?? 'get').toLowerCase();
  const path = requestPath(config);

  try {
    const mocked =
      (await resolveDiscoverMock(method, path, config.params, config.signal)) ??
      (await resolveStoreMock(method, path, config.signal)) ??
      (await resolveMessagesMock(method, path, config.signal, config.data));
    if (!mocked) return getHttpAdapter()(config);

    const response = {
      data: mocked.data,
      status: mocked.status,
      statusText: mocked.status >= 400 ? 'Error' : 'OK',
      headers: {},
      config,
    } as AxiosResponse;

    if (mocked.status >= 400) {
      throw new AxiosError('Request failed', AxiosError.ERR_BAD_REQUEST, config, null, response);
    }

    return response;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new AxiosError('canceled', AxiosError.ERR_CANCELED, config);
    }
    throw error;
  }
};

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_HOST,
  timeout: 1000,
  withCredentials: true,
  adapter: mockingAdapter,
});
let requestInterceptor: number | null = null;
let responseInterceptor: number | null = null;
let apiRequestController = new AbortController();
let retryCount = 0;
const maxRetries = 5;

export const abortAllRequests = () => {
  apiRequestController.abort();
  apiRequestController = new AbortController();
  apiClient.defaults.signal = apiRequestController.signal;
};

export const ejectAuthInterceptor = () => {
  if (requestInterceptor !== null) {
    apiClient.interceptors.request.eject(requestInterceptor);
    requestInterceptor = null;
  }
  if (responseInterceptor !== null) {
    apiClient.interceptors.response.eject(responseInterceptor);
    responseInterceptor = null;
  }
  retryCount = 0;
};

export const applyAuthInterceptor = (
  accessToken: string,
  onLogout: () => void,
  onRefresh: () => void
) => {
  ejectAuthInterceptor();
  const onBeforeRequest = async (config: InternalAxiosRequestConfig) => {
    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  };
  requestInterceptor = apiClient.interceptors.request.use(onBeforeRequest);

  responseInterceptor = apiClient.interceptors.response.use(
    (config) => {
      retryCount = 0;
      return config;
    },
    (error) => {
      if (error.response?.status === 401) {
        retryCount += 1;
        if (retryCount >= maxRetries) {
          onLogout();
        } else {
          onRefresh();
        }
      }
      return Promise.reject(error);
    }
  );
};

export default apiClient;
