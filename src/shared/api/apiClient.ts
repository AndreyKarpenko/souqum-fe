import axios, {
  AxiosError,
  getAdapter,
  type AxiosAdapter,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

declare module 'axios' {
  interface AxiosRequestConfig {
    skipAuthRefresh?: boolean;
  }
}
import { resolveDiscoverMock } from '@/shared/api/mock/discoverMock.ts';
import { resolveMessagesMock } from '@/shared/api/mock/messagesMock.ts';
import { readSessionUser, resolveProfileMock } from '@/shared/api/mock/profileMock.ts';
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

  const aborted = (error: unknown) => error instanceof DOMException && error.name === 'AbortError';

  if (method === 'get' && path === '/user') {
    try {
      return await getHttpAdapter()(config);
    } catch (error) {
      if (aborted(error) || axios.isCancel(error)) {
        throw new AxiosError('canceled', AxiosError.ERR_CANCELED, config);
      }
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        throw error;
      }
      const response = {
        data: readSessionUser(),
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      } as AxiosResponse;
      return response;
    }
  }

  try {
    const mocked =
      (await resolveDiscoverMock(method, path, config.params, config.signal)) ??
      (await resolveStoreMock(method, path, config.signal)) ??
      (await resolveProfileMock(method, path, config.signal, config.data)) ??
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
let apiRequestController = new AbortController();

const PUBLIC_AUTH_PATHS = new Set([
  '/auth/signin',
  '/auth/signup',
  '/auth/verify-otp',
  '/auth/refresh-token',
  '/auth/logout',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/confirm-email',
  '/auth/resend-confirm-email',
  '/auth/resend-otp',
]);

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

const skipsTokenRefresh = (config: InternalAxiosRequestConfig) =>
  config.skipAuthRefresh === true || PUBLIC_AUTH_PATHS.has(requestPath(config));

let onSessionExpired: (() => void | Promise<void>) | null = null;
let sessionExpiry: Promise<void> | null = null;

export const setSessionExpiredHandler = (handler: (() => void | Promise<void>) | null) => {
  onSessionExpired = handler;
};

const notifySessionExpired = () => {
  if (sessionExpiry) return sessionExpiry;

  sessionExpiry = Promise.resolve()
    .then(() => onSessionExpired?.())
    .finally(() => {
      sessionExpiry = null;
    });

  return sessionExpiry;
};

let refreshPromise: Promise<void> | null = null;

const refreshSession = () => {
  if (!refreshPromise) {
    refreshPromise = apiClient
      .post('/auth/refresh-token', undefined, { skipAuthRefresh: true, timeout: 8000 })
      .then(() => undefined)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

export const abortAllRequests = () => {
  apiRequestController.abort();
  apiRequestController = new AbortController();
  apiClient.defaults.signal = apiRequestController.signal;
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryConfig | undefined;
    const status = error.response?.status;

    if (
      !config ||
      status !== 401 ||
      config._retry ||
      skipsTokenRefresh(config) ||
      config.signal?.aborted
    ) {
      return Promise.reject(error);
    }

    config._retry = true;

    try {
      await refreshSession();
    } catch {
      await notifySessionExpired();
      return Promise.reject(error);
    }

    return apiClient.request(config);
  }
);

export default apiClient;
