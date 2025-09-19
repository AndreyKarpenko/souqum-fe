import instance from '@/app/api/apiClient';

export const login = async (data: any) => {
  return await instance.post('/auth/login', data);
};

export const signUp = async (data: any) => {
  return await instance.post('/account', data);
};
