import apiClient from '@/app/api/apiClient';

export const signInApi = async (data: any) => {
  return await apiClient.post('/auth/login', data);
};

export const getUserInfoApi = async () => {
  return await apiClient.get('/account/me');
};

export const signUpApi = async (data: any) => {
  return await apiClient.post('/account', data);
};
