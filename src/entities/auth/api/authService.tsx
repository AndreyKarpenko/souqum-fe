import apiClient from '@/app/api/apiClient.tsx';

export const signInApi = async (params: any): Promise<{ accessToken: string }> => {
  const { data } = await apiClient.post('/auth/signin', params);
  return data;
};

export const refreshTokenApi = async (): Promise<{ accessToken: string }> => {
  const { data } = await apiClient.post('/auth/refresh');
  return data;
};

export const signUpApi = async (parms: any) => {
  const { data } = await apiClient.post('/auth/signup', parms);
  return data;
};
