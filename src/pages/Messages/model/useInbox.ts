import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import {
  deleteInboxConversationApi,
  deleteInboxMessageApi,
  getInboxApi,
  sendStoreMessageApi,
  type InboxConversation,
  type InboxFeed,
  type SendStoreMessageInput,
} from '@/entities/inbox';

const isAbort = (error: unknown) =>
  axios.isCancel(error) || (error instanceof DOMException && error.name === 'AbortError');

const mergeConversation = (feed: InboxFeed, conversation: InboxConversation): InboxFeed => {
  const exists = feed.conversations.some((item) => item.id === conversation.id);
  const conversations = exists
    ? feed.conversations.map((item) => (item.id === conversation.id ? conversation : item))
    : [conversation, ...feed.conversations];
  const filters = feed.filters.some((filter) => filter.id === conversation.storeId)
    ? feed.filters
    : [...feed.filters, { id: conversation.storeId, label: conversation.storeName }];

  return { filters, conversations };
};

export const useInbox = () => {
  const [feed, setFeed] = useState<InboxFeed | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [loadId, setLoadId] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setStatus('loading');

    getInboxApi(controller.signal)
      .then((next) => {
        if (controller.signal.aborted) return;
        setFeed(next);
        setStatus('ready');
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted || isAbort(error)) return;
        setStatus('error');
      });

    return () => controller.abort();
  }, [loadId]);

  const reload = useCallback(() => {
    setLoadId((value) => value + 1);
  }, []);

  const removeConversation = useCallback(async (conversationId: string) => {
    setPendingDelete(`conversation:${conversationId}`);
    setDeleteError(null);

    try {
      await deleteInboxConversationApi(conversationId);
      setFeed((current) => {
        if (!current) return current;
        const removed = current.conversations.find((item) => item.id === conversationId);
        const conversations = current.conversations.filter((item) => item.id !== conversationId);
        const filters = current.filters.filter(
          (filter) =>
            filter.id === 'all' ||
            filter.id !== removed?.storeId ||
            conversations.some((item) => item.storeId === filter.id)
        );
        return { filters, conversations };
      });
      return true;
    } catch (error: unknown) {
      if (isAbort(error)) return false;
      setDeleteError('Не вдалося видалити діалог');
      return false;
    } finally {
      setPendingDelete(null);
    }
  }, []);

  const removeMessage = useCallback(async (conversationId: string, messageId: string) => {
    setPendingDelete(`message:${messageId}`);
    setDeleteError(null);

    try {
      const conversation = await deleteInboxMessageApi(conversationId, messageId);
      setFeed((current) => (current ? mergeConversation(current, conversation) : current));
      return true;
    } catch (error: unknown) {
      if (isAbort(error)) return false;
      setDeleteError('Не вдалося видалити повідомлення');
      return false;
    } finally {
      setPendingDelete(null);
    }
  }, []);

  const send = useCallback(async (input: SendStoreMessageInput) => {
    setSending(true);
    setSendError(null);

    try {
      const conversation = await sendStoreMessageApi(input);
      setFeed((current) => (current ? mergeConversation(current, conversation) : current));
      return conversation;
    } catch (error: unknown) {
      if (isAbort(error)) return null;
      setSendError('Не вдалося надіслати повідомлення');
      return null;
    } finally {
      setSending(false);
    }
  }, []);

  return {
    feed,
    status,
    reload,
    send,
    sending,
    sendError,
    removeConversation,
    removeMessage,
    pendingDelete,
    deleteError,
  };
};
