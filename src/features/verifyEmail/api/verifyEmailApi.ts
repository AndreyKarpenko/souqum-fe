import apiClient from '@/shared/api/apiClient';

export const resendEmailVerificationApi = async (params: { email: string }) => {
  const { data } = await apiClient.post('/auth/resend-confirm-email', params);
  return data;
};

export const verifyEmailVerificationApi = async (params: { token: string }) => {
  const { data } = await apiClient.get(`/auth/confirm-email?token=${params.token}`);
  return data;
};
