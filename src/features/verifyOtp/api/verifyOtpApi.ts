import apiClient from '@/shared/api/apiClient';

export const verifyOtpApi = async (params: { sid: string; otp: string }) => {
  const { data } = await apiClient.post('/auth/verify-otp', params);
  return data;
};
