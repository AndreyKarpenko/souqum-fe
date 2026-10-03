import apiClient from '@/shared/api/apiClient';

export const likePostApi = async (postId: string) => {
  await apiClient.post(`/likes/post/${postId}`);
};

export const unlikePostApi = async (postId: string) => {
  await apiClient.delete(`/likes/post/${postId}`);
};

export const likeCommentApi = async (commentId: string) => {
  await apiClient.post(`/likes/comment/${commentId}`);
};

export const unlikeCommentApi = async (commentId: string) => {
  await apiClient.delete(`/likes/comment/${commentId}`);
};
