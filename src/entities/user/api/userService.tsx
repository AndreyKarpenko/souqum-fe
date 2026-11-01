import apiClient from '@/shared/api/apiClient';
import type { User } from '@/entities/user/model/types.ts';

const userRequest = (signal?: AbortSignal) => ({
  timeout: 8000,
  ...(signal ? { signal } : {}),
});

export const getMyProfileApi = async (signal?: AbortSignal) => {
  const { data } = await apiClient.get('/user', userRequest(signal));
  return data;
};

export const getUserProfileApi = async (id: string, signal?: AbortSignal): Promise<User | null> => {
  const { data } = await apiClient.get(`/user/${id}`, userRequest(signal));
  return data;
};

export const getAllUsersApi = async () => {
  const { data } = await apiClient.get('/user/all');
  return data;
};

export const getSubscribersApi = async () => {
  const { data } = await apiClient.get('/user/subscribers');
  return data;
};

export const getSubscriptionsApi = async () => {
  const { data } = await apiClient.get('/user/subscriptions');
  return data;
};
