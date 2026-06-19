import apiClient from '@/app/api/apiClient.tsx';

export const signInApi = async (params: {
  email: string;
  password: string;
}): Promise<{ is2FAEnabled: boolean; sid?: string }> => {
  const { data } = await apiClient.post<{ is2FAEnabled: boolean; sid?: string }>(
    '/auth/signin',
    params
  );
  return data;
};

export const signUpApi = async (params: { email: string; password: string }) => {
  await apiClient.post('/auth/signup', params);
};

export const getMeApi = async (): Promise<{ firstName: string; lastName: string }> => {
  const { data } = await apiClient.get<{ firstName: string; lastName: string }>('/user');
  return data;
};

export const refreshTokenApi = async () => {
  const { data } = await apiClient.post('/auth/refresh-token');
  return data;
};

export const verifyOtpApi = async (params: { sid: string; otp: string }) => {
  const { data } = await apiClient.post('/auth/verify-otp', params);
  return data;
};

export const resendEmailVerificationApi = async (params: { email: string }) => {
  const { data } = await apiClient.post('/auth/resend-confirm-email', params);
  return data;
};

export const verifyEmailVerificationApi = async (params: { token: string }) => {
  const { data } = await apiClient.get(`/auth/confirm-email?token=${params.token}`);
  return data;
};

export const forgotPasswordApi = async (params: { email: string }) => {
  const { data } = await apiClient.post(`/auth/forgot-password`, params);
  return data;
};

export const resetPasswordApi = async (params: { password: string; token: string }) => {
  const { data } = await apiClient.post(`/auth/reset-password`, params);
  return data;
};
