import apiClient from '@/shared/api/apiClient';

export const getPostsApi = async () => {
  const { data } = await apiClient.get('/posts');
  return data;
};

export const getUserPostsApi = async (accountId: string) => {
  const { data } = await apiClient.get(`/posts/user/${accountId}`);
  return data;
};

export const createPostApi = async (formData: FormData) => {
  await apiClient.post('/posts', formData);
};

export const repostPostApi = async (
  postId: string,
  body: { content: string; title: string }
) => {
  await apiClient.post(`/posts/repost/${postId}`, body);
};

export const deletePostApi = async (id: string) => {
  await apiClient.delete(`/posts/${id}`);
};
