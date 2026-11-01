import apiClient from '@/shared/api/apiClient';

export const signOutApi = async () => {
  try {
    await apiClient.post('/auth/logout', undefined, { skipAuthRefresh: true });
  } catch {
    /* empty */
  }
};
