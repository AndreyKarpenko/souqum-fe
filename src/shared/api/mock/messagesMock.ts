import type { GenericAbortSignal } from 'axios';
import type { InboxAvatar, InboxConversation, InboxFeed } from '@/entities/inbox/model/types.ts';
import { readStoreDto } from '@/shared/api/mock/discoverMock.ts';

type MockResult = {
  status: number;
  data: unknown;
};

const wait = (ms: number, signal?: GenericAbortSignal) =>
  new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('The operation was aborted.', 'AbortError'));
      return;
    }

    const onAbort = () => {
      clearTimeout(timer);
      reject(new DOMException('The operation was aborted.', 'AbortError'));
    };
    const timer = setTimeout(() => {
      signal?.removeEventListener?.('abort', onAbort);
      resolve();
    }, ms);

    signal?.addEventListener?.('abort', onAbort, { once: true });
  });

const customerName = 'Марія';

const feed: InboxFeed = {
  filters: [
    { id: 'all', label: 'Всі' },
    { id: 'cool-coffee', label: 'Cool Coffee' },
    { id: 'keramos', label: 'Keramos' },
  ],
  conversations: [
    {
      id: 'maria-cool-coffee',
      title: 'Марія → Cool Coffee',
      preview: 'Чи є дрібне зерно?',
      storeId: 'cool-coffee',
      storeName: 'Cool Coffee',
      avatar: 'warm',
      subtitle: 'відповідь від імені магазину',
      mine: true,
      messages: [
        {
          id: 'maria-1',
          authorName: 'Марія',
          role: 'customer',
          text: 'Чи є помел під еспресо?',
        },
        {
          id: 'maria-2',
          authorName: 'Cool Coffee',
          role: 'store',
          text: 'Так, помілимо перед відправкою. Напишіть ступінь у замовленні.',
        },
      ],
    },
    {
      id: 'linen-atelier',
      title: 'Linen Atelier',
      preview: 'Ви пишете магазину',
      storeId: 'linen-atelier',
      storeName: 'Linen Atelier',
      avatar: 'linen',
      subtitle: 'Ви пишете магазину',
      mine: true,
      messages: [],
    },
    {
      id: 'igor-keramos',
      title: 'Ігор → Keramos',
      preview: 'Дякую, паку отримав',
      storeId: 'keramos',
      storeName: 'Keramos',
      avatar: 'cool',
      subtitle: 'відповідь від імені магазину',
      mine: false,
      messages: [
        {
          id: 'igor-1',
          authorName: 'Ігор',
          role: 'customer',
          text: 'Дякую, паку отримав',
        },
      ],
    },
  ],
};

let messageSeq = 0;

const avatarFor = (storeId: string): InboxAvatar => {
  if (storeId === 'linen-atelier') return 'linen';
  if (storeId === 'keramos') return 'cool';
  return 'warm';
};

const readBody = (body: unknown): Record<string, unknown> | null => {
  const asRecord = (value: unknown) =>
    value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : null;

  if (typeof body === 'string') {
    try {
      return asRecord(JSON.parse(body));
    } catch {
      return null;
    }
  }

  return asRecord(body);
};

const cloneConversation = (conversation: InboxConversation): InboxConversation => ({
  ...conversation,
  messages: conversation.messages.map((message) => ({ ...message })),
});

const sendStoreMessage = async (body: unknown, signal?: GenericAbortSignal) => {
  const payload = readBody(body);
  const storeId = typeof payload?.storeId === 'string' ? payload.storeId : '';
  const text = typeof payload?.text === 'string' ? payload.text.trim() : '';
  const conversationId = typeof payload?.conversationId === 'string' ? payload.conversationId : undefined;

  if (!storeId || !text) return { status: 400, data: { message: 'Message text is required' } };

  const store = readStoreDto(storeId);
  const existing = conversationId
    ? feed.conversations.find((item) => item.id === conversationId)
    : feed.conversations.find((item) => item.mine && item.storeId === storeId);

  if (!existing && !store) return { status: 404, data: { message: 'Store not found' } };

  await wait(160, signal);

  messageSeq += 1;
  const message = {
    id: `msg-${messageSeq}`,
    authorName: customerName,
    role: 'customer' as const,
    text,
  };

  let conversation = existing;
  if (!conversation) {
    if (!store) return { status: 404, data: { message: 'Store not found' } };
    conversation = {
      id: `me-${store.id}`,
      title: `${customerName} → ${store.name}`,
      preview: text,
      storeId: store.id,
      storeName: store.name,
      avatar: avatarFor(store.id),
      subtitle: 'Ви пишете магазину',
      mine: true,
      messages: [message],
    };
    feed.conversations.unshift(conversation);
    if (!feed.filters.some((filter) => filter.id === store.id)) {
      feed.filters.push({ id: store.id, label: store.name });
    }
  } else {
    conversation.messages.push(message);
    conversation.preview = text;
  }

  return { status: 200, data: cloneConversation(conversation) };
};

const deleteConversation = async (conversationId: string, signal?: GenericAbortSignal) => {
  if (!feed.conversations.some((item) => item.id === conversationId)) {
    return { status: 404, data: { message: 'Conversation not found' } };
  }

  await wait(120, signal);
  const index = feed.conversations.findIndex((item) => item.id === conversationId);
  if (index < 0) return { status: 404, data: { message: 'Conversation not found' } };
  const [removed] = feed.conversations.splice(index, 1);
  if (removed && !feed.conversations.some((item) => item.storeId === removed.storeId)) {
    feed.filters = feed.filters.filter((filter) => filter.id === 'all' || filter.id !== removed.storeId);
  }
  return { status: 200, data: null };
};

const deleteMessage = async (conversationId: string, messageId: string, signal?: GenericAbortSignal) => {
  const conversation = feed.conversations.find((item) => item.id === conversationId);
  if (!conversation) return { status: 404, data: { message: 'Conversation not found' } };
  if (!conversation.messages.some((item) => item.id === messageId)) {
    return { status: 404, data: { message: 'Message not found' } };
  }

  await wait(120, signal);
  const index = conversation.messages.findIndex((item) => item.id === messageId);
  if (index < 0) return { status: 404, data: { message: 'Message not found' } };
  conversation.messages.splice(index, 1);
  conversation.preview = conversation.messages[conversation.messages.length - 1]?.text ?? '';
  return { status: 200, data: cloneConversation(conversation) };
};

export const resolveMessagesMock = async (
  method: string,
  path: string,
  signal?: GenericAbortSignal,
  body?: unknown
): Promise<MockResult | null> => {
  const normalized = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
  if (method === 'post' && normalized === '/inbox/messages') {
    return sendStoreMessage(body, signal);
  }
  if (method === 'delete') {
    const messageMatch = normalized.match(/^\/inbox\/conversations\/([^/]+)\/messages\/([^/]+)$/);
    if (messageMatch) {
      return deleteMessage(decodeURIComponent(messageMatch[1]), decodeURIComponent(messageMatch[2]), signal);
    }
    const conversationMatch = normalized.match(/^\/inbox\/conversations\/([^/]+)$/);
    if (conversationMatch) return deleteConversation(decodeURIComponent(conversationMatch[1]), signal);
  }
  if (method === 'get' && normalized === '/user') {
    return {
      status: 200,
      data: {
        accountId: 'me',
        email: 'maria@example.com',
        firstName: 'Марія',
        lastName: '',
        bio: null,
        avatar: null,
      },
    };
  }
  if (method !== 'get' || normalized !== '/inbox') return null;

  await wait(180, signal);
  return { status: 200, data: feed };
};
