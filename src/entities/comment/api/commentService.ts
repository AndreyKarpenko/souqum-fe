import apiClient from '@/shared/api/apiClient';

export const getPostCommentsApi = async (postId: string) => {
  const { data } = await apiClient.get(`/comments/${postId}`);
  return data;
};

export const createCommentApi = async (formData: FormData) => {
  await apiClient.post('/comments', formData);
};

export const deleteCommentApi = async (id: string) => {
  await apiClient.delete(`/comments/${id}`);
};
