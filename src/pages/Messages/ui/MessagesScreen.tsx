import { useEffect, useState, type FC } from 'react';
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router';
import type { InboxConversation } from '@/entities/inbox';
import { useInbox } from '@/pages/Messages/model/useInbox.ts';
import { useStore } from '@/pages/Store/model/useStore.ts';
import { ConversationList } from '@/pages/Messages/ui/ConversationList.tsx';
import { ThreadView } from '@/pages/Messages/ui/ThreadView.tsx';

const byStore = (conversations: InboxConversation[], storeId: string) =>
  storeId === 'all' ? conversations : conversations.filter((item) => item.storeId === storeId);

const draftFor = (storeId: string, storeName: string): InboxConversation => ({
  id: `draft-${storeId}`,
  title: storeName,
  preview: '',
  storeId,
  storeName,
  avatar: 'warm',
  subtitle: 'Ви пишете магазину',
  mine: true,
  messages: [],
});

export const MessagesScreen: FC = () => {
  const {
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
  } = useInbox();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const composeStoreId = searchParams.get('store') || undefined;
  const composeStore = useStore(composeStoreId);
  const navigate = useNavigate();
  const [storeId, setStoreId] = useState('all');
  const [threadOpen, setThreadOpen] = useState(Boolean(id) || Boolean(composeStoreId));

  useEffect(() => {
    if (id || composeStoreId) setThreadOpen(true);
  }, [id, composeStoreId]);

  if (status === 'loading') return <InboxSkeleton />;

  if (status === 'error' || !feed) {
    return (
      <div className="rounded-[20px] bg-white px-6 py-12 text-center">
        <p className="text-sm text-[#032048]">Не вдалося завантажити повідомлення</p>
        <button
          type="button"
          className="mt-4 h-10 cursor-pointer rounded-full bg-[#032048] px-5 text-sm font-medium text-white"
          onClick={reload}
        >
          Спробувати ще раз
        </button>
      </div>
    );
  }

  const outgoing = composeStoreId
    ? feed.conversations.find((item) => item.mine && item.storeId === composeStoreId)
    : undefined;

  if (outgoing) return <Navigate to={`/messages/${outgoing.id}`} replace />;

  const drafting = Boolean(composeStoreId);
  const draft =
    drafting && composeStore.profile ? draftFor(composeStore.profile.id, composeStore.profile.name) : null;
  const visible = byStore(feed.conversations, storeId);
  const selected = drafting ? null : (visible.find((item) => item.id === id) ?? visible[0] ?? null);
  const thread = draft ?? selected;

  const openConversation = (conversationId: string) => {
    navigate(`/messages/${conversationId}`);
    setThreadOpen(true);
  };

  const sendMessage = async (text: string) => {
    const target = draft ?? selected;
    if (!target) return false;
    const conversation = await send({
      storeId: target.storeId,
      text,
      conversationId: draft ? undefined : target.id,
    });
    if (!conversation) return false;
    if (draft) navigate(`/messages/${conversation.id}`, { replace: true });
    return true;
  };

  const deleteConversation = async (conversationId: string) => {
    const wasOpen = !draft && (selected?.id === conversationId || id === conversationId);
    const removed = await removeConversation(conversationId);
    if (!removed || !feed) return;

    const remaining = feed.conversations.filter((item) => item.id !== conversationId);
    if (storeId !== 'all' && !remaining.some((item) => item.storeId === storeId)) setStoreId('all');
    if (!wasOpen) return;

    const nextPool = storeId === 'all' ? remaining : remaining.filter((item) => item.storeId === storeId);
    if (nextPool[0]) {
      navigate(`/messages/${nextPool[0].id}`, { replace: true });
      setThreadOpen(true);
      return;
    }
    navigate('/messages', { replace: true });
    setThreadOpen(false);
  };

  const deleteMessage = (messageId: string) => {
    if (!thread || thread.id.startsWith('draft-')) return;
    void removeMessage(thread.id, messageId);
  };

  const changeStore = (nextStoreId: string) => {
    setStoreId(nextStoreId);
    const nextVisible = byStore(feed.conversations, nextStoreId);
    if (nextVisible.some((item) => item.id === selected?.id)) return;
    if (nextVisible[0]) {
      navigate(`/messages/${nextVisible[0].id}`, { replace: true });
      return;
    }
    navigate('/messages', { replace: true });
  };

  const deletingConversationId = pendingDelete?.startsWith('conversation:')
    ? pendingDelete.slice('conversation:'.length)
    : null;
  const deletingMessageId = pendingDelete?.startsWith('message:')
    ? pendingDelete.slice('message:'.length)
    : null;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      {deleteError && <p className="text-sm text-[#C4564E]">{deleteError}</p>}
      <div className="flex min-h-0 flex-1 flex-col gap-4 lg:flex-row">
      <ConversationList
        filters={feed.filters}
        storeId={storeId}
        conversations={visible}
        selectedId={draft ? null : (selected?.id ?? null)}
        threadOpen={threadOpen}
        deletingId={deletingConversationId}
        onStoreChange={changeStore}
        onSelect={openConversation}
        onDelete={(conversationId) => void deleteConversation(conversationId)}
      />
      <div className={threadOpen ? 'flex min-h-0 min-w-0 flex-1' : 'hidden min-h-0 min-w-0 flex-1 lg:flex'}>
        {drafting && !draft ? (
          <section className="flex min-h-0 min-w-0 flex-1 items-center justify-center rounded-[20px] bg-[#FBF8F1] px-6">
            <p className="text-sm text-[#032048]/60">
              {composeStore.status === 'missing' || composeStore.status === 'error'
                ? 'Магазин не знайдено'
                : 'Завантаження діалогу'}
            </p>
          </section>
        ) : (
          <ThreadView
            conversation={thread}
            sending={sending}
            sendError={sendError}
            deletingMessageId={deletingMessageId}
            deletingConversation={Boolean(thread && deletingConversationId === thread.id)}
            onBack={() => setThreadOpen(false)}
            onSend={sendMessage}
            onDeleteMessage={deleteMessage}
            onDeleteConversation={() => {
              if (thread) void deleteConversation(thread.id);
            }}
          />
        )}
      </div>
      </div>
    </div>
  );
};

const InboxSkeleton: FC = () => (
  <div
    className="flex min-h-0 flex-1 flex-col gap-4 lg:flex-row"
    aria-busy="true"
    aria-label="Завантаження повідомлень"
  >
    <div className="h-72 animate-pulse rounded-[20px] bg-white/80 lg:h-auto lg:w-[380px]" />
    <div className="min-h-72 flex-1 animate-pulse rounded-[20px] bg-white/80" />
  </div>
);

export default MessagesScreen;
