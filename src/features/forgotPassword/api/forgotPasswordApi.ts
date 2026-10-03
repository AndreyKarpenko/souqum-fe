import apiClient from '@/shared/api/apiClient';

export const forgotPasswordApi = async (params: { email: string }) => {
  const { data } = await apiClient.post('/auth/forgot-password', params);
  return data;
};
