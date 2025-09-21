import axios, { type AxiosError } from 'axios';
import { store } from '@/app/store';
import { removeUser } from '@/entities/user/redux';

const instance = axios.create({
  baseURL: import.meta.env.VITE_HOST,
  timeout: 1000,
  withCredentials: true,
});

instance.interceptors.response.use(
  (config) => config,
  (error: AxiosError) => {
    if (error.status === 401) {
      void store.dispatch(removeUser());
      return;
    }
    return Promise.reject(error);
  }
);

export default instance;
