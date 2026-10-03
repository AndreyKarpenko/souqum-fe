import apiClient from '@/shared/api/apiClient';
import type { User } from '@/entities/user/model/types.ts';

export const getMyProfileApi = async () => {
  const { data } = await apiClient.get('/user');
  return data;
};

export const getUserProfileApi = async (id: string): Promise<User> => {
  const { data } = await apiClient.get(`/user/${id}`);
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
