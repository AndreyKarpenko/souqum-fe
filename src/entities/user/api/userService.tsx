import apiClient from '@/app/api/apiClient.tsx';
import type { User } from '@/entities/user/model/types.ts';

export const getMyProfileApi = async () => {
  const { data } = await apiClient.get('/account/me');
  return data;
};

export const getUserProfileApi = async (id: string): Promise<User> => {
  const { data } = await apiClient.get(`/account/${id}`);
  return data;
};
