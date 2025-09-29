import axios, { type InternalAxiosRequestConfig } from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_HOST,
  timeout: 1000,
  withCredentials: true,
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
