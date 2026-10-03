import apiClient from '@/shared/api/apiClient';

export const signOutApi = async () => {
  try {
    await apiClient.post('/auth/logout');
  } catch {
    /* empty */
  }
};
