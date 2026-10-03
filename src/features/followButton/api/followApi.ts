import apiClient from '@/shared/api/apiClient';

export const followUserApi = async (accountId: string) => {
  await apiClient.post(`user/subscribe/${accountId}`);
};

export const unfollowUserApi = async (accountId: string) => {
  await apiClient.delete(`user/unsubscribe/${accountId}`);
};
