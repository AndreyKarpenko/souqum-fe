import apiClient from '@/shared/api/apiClient';

export const getDialogsApi = async () => {
  const { data } = await apiClient.get('/dialogs');
  return data;
};

export const createDialogApi = async (participantIds: string[]) => {
  const { data } = await apiClient.post('/dialogs', { participantIds });
  return data;
};

export const deleteDialogApi = async (id: string) => {
  await apiClient.delete(`/dialogs/${id}`);
};
