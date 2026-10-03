import apiClient from '@/shared/api/apiClient';

export const resetPasswordApi = async (params: { password: string; token: string }) => {
  const { data } = await apiClient.post('/auth/reset-password', params);
  return data;
};
