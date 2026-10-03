import apiClient from '@/shared/api/apiClient';

export const signUpApi = async (params: {
  firstName: string;
  email: string;
  password: string;
}) => {
  await apiClient.post('/auth/signup', params);
};
