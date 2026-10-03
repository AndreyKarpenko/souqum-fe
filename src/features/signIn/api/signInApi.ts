import apiClient from '@/shared/api/apiClient';

export const signInApi = async (params: { email: string; password: string }) => {
  const { data } = await apiClient.post<{ is2FAEnabled: boolean; sid?: string }>(
    '/auth/signin',
    params
  );
  return data;
};
