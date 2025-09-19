import instance from '@/app/api/apiClient.tsx';

export const logout = async () => {
  try {
    await instance.post('/auth/logout');
  } catch {
    /* empty */
  }
};
