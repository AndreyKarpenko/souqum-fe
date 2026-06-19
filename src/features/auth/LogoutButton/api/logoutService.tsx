import apiClient from '@/app/api/apiClient.tsx';

export const signOutApi = async () => {
  try {
    await apiClient.post('/auth/logout');
  } catch {
    /* empty */
  }
};
