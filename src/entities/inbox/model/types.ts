export type InboxAvatar = 'warm' | 'linen' | 'cool';

export type InboxRole = 'customer' | 'store';

export type InboxStoreFilter = {
  id: string;
  label: string;
};

export type InboxMessage = {
  id: string;
  authorName: string;
  role: InboxRole;
  text: string;
};

export type InboxConversation = {
  id: string;
  title: string;
  preview: string;
  storeId: string;
  storeName: string;
  avatar: InboxAvatar;
  subtitle: string;
  mine: boolean;
  messages: InboxMessage[];
};

export type SendStoreMessageInput = {
  storeId: string;
  text: string;
  conversationId?: string;
};

export type InboxFeed = {
  filters: InboxStoreFilter[];
  conversations: InboxConversation[];
};
