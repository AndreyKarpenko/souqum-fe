import apiClient from '@/shared/api/apiClient';
import type { InboxConversation, InboxFeed, SendStoreMessageInput } from '@/entities/inbox/model/types.ts';

export const getInboxApi = async (signal?: AbortSignal): Promise<InboxFeed> => {
  const { data } = await apiClient.get<InboxFeed>('/inbox', signal ? { signal } : undefined);
  return data;
};

export const sendStoreMessageApi = async (input: SendStoreMessageInput): Promise<InboxConversation> => {
  const { data } = await apiClient.post<InboxConversation>('/inbox/messages', input);
  return data;
};

export const deleteInboxConversationApi = async (conversationId: string): Promise<void> => {
  await apiClient.delete(`/inbox/conversations/${conversationId}`);
};

export const deleteInboxMessageApi = async (
  conversationId: string,
  messageId: string
): Promise<InboxConversation> => {
  const { data } = await apiClient.delete<InboxConversation>(
    `/inbox/conversations/${conversationId}/messages/${messageId}`
  );
  return data;
};
