import apiClient from '@/shared/api/apiClient';

export const refreshTokenApi = async () => {
  const { data } = await apiClient.post('/auth/refresh-token');
  return data;
};
