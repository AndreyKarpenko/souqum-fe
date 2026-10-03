import apiClient from '@/shared/api/apiClient';

export const getMessagesApi = async (dialogId: string) => {
  const { data } = await apiClient.get(`/messages/${dialogId}`);
  return data;
};

export const sendMessageApi = async (formData: FormData) => {
  await apiClient.post('/messages', formData);
};

export const deleteMessageApi = async (id: string) => {
  await apiClient.delete(`/messages/${id}`);
};
