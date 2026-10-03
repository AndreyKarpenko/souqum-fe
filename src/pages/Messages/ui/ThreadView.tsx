import { useEffect, useRef, useState, type FC, type FormEvent } from 'react';
import { ChevronLeft, Trash2 } from 'lucide-react';
import type { InboxConversation } from '@/entities/inbox';
import { inboxAvatarClassName } from '@/pages/Messages/ui/inboxAvatar.ts';

type ThreadViewProps = {
  conversation: InboxConversation | null;
  sending: boolean;
  sendError: string | null;
  deletingMessageId: string | null;
  deletingConversation: boolean;
  onBack: () => void;
  onSend: (text: string) => Promise<boolean>;
  onDeleteMessage: (messageId: string) => void;
  onDeleteConversation: () => void;
};

export const ThreadView: FC<ThreadViewProps> = ({
  conversation,
  sending,
  sendError,
  deletingMessageId,
  deletingConversation,
  onBack,
  onSend,
  onDeleteMessage,
  onDeleteConversation,
}) => {
  const [text, setText] = useState('');
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const conversationId = conversation?.id;
  const emptyThread = Boolean(conversation && conversation.messages.length === 0);

  useEffect(() => {
    setText('');
  }, [conversationId]);

  useEffect(() => {
    if (emptyThread) inputRef.current?.focus();
  }, [conversationId, emptyThread]);

  useEffect(() => {
    const node = listRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [conversation?.id, conversation?.messages.length]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = text.trim();
    if (!value || sending || !conversation) return;
    void onSend(value).then((sent) => {
      if (sent) setText('');
    });
  };

  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-[20px] bg-[#FBF8F1]">
      {conversation ? (
        <>
          <header className="border-b border-[#E7E0D4] px-5 py-4">
            <button
              type="button"
              className="mb-3 flex cursor-pointer items-center gap-1 text-sm font-medium text-[#032048] lg:hidden"
              onClick={onBack}
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={2} />
              Усі діалоги
            </button>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h1 className="text-[15px] leading-tight font-semibold text-[#032048]">{conversation.title}</h1>
                <p className="mt-1 text-[13px] leading-tight text-[#032048]/45">{conversation.subtitle}</p>
              </div>
              {!conversation.id.startsWith('draft-') && (
                <button
                  type="button"
                  disabled={deletingConversation}
                  className="h-8 shrink-0 cursor-pointer rounded-full bg-white px-3 text-[13px] font-medium text-[#C4564E] disabled:cursor-default disabled:opacity-60"
                  onClick={onDeleteConversation}
                >
                  Видалити діалог
                </button>
              )}
            </div>
          </header>
          <div ref={listRef} className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-4 sm:px-5">
            {conversation.messages.map((message) => {
              const fromStore = message.role === 'store';
              const deleting = deletingMessageId === message.id;
              const initial = message.authorName.trim()[0]?.toUpperCase() ?? '';
              return (
                <div
                  key={message.id}
                  className={`flex items-end gap-2 ${fromStore ? 'flex-row-reverse' : ''}`}
                >
                  {fromStore ? (
                    <span
                      aria-hidden="true"
                      className={`h-8 w-8 shrink-0 rounded-full ${inboxAvatarClassName[conversation.avatar]}`}
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#032048] text-[12px] font-semibold text-white"
                    >
                      {initial}
                    </span>
                  )}
                  <div
                    className={`group flex max-w-[min(100%,640px)] items-center gap-2 rounded-2xl px-4 py-3 ${
                      fromStore ? 'bg-[#032048] text-white' : 'bg-[#F3EBDD]'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-[13px] leading-tight font-medium ${
                          fromStore ? 'text-[#E8A317]' : 'text-[#C56A3A]'
                        }`}
                      >
                        {message.authorName}
                      </p>
                      <p className={`mt-1 text-[14px] leading-snug ${fromStore ? '' : 'text-[#032048]'}`}>
                        {message.text}
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label="Видалити повідомлення"
                      disabled={deleting}
                      className={`grid h-7 w-7 shrink-0 cursor-pointer place-items-center self-center rounded-full disabled:cursor-default ${
                        deleting
                          ? 'opacity-60'
                          : 'pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100 focus-visible:pointer-events-auto focus-visible:opacity-100'
                      } ${
                        fromStore ? 'text-white/70 hover:bg-white/10 hover:text-white' : 'text-[#032048]/40 hover:bg-white hover:text-[#C4564E]'
                      }`}
                      onClick={() => onDeleteMessage(message.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <form onSubmit={submit} className="flex flex-col gap-2 border-t border-[#E7E0D4] px-4 py-3 sm:px-5">
            {sendError && <p className="text-sm text-[#C4564E]">{sendError}</p>}
            <div className="flex gap-2">
              <input
                ref={inputRef}
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="Повідомлення"
                aria-label="Повідомлення"
                className="h-11 min-w-0 flex-1 rounded-full border border-[#E6DFD4] bg-white px-4 text-sm text-[#032048] outline-none placeholder:text-[#032048]/40"
              />
              <button
                type="submit"
                disabled={sending || text.trim().length === 0}
                className="h-11 shrink-0 cursor-pointer rounded-full bg-[#032048] px-4 text-sm font-medium text-white disabled:cursor-default disabled:opacity-60"
              >
                Надіслати
              </button>
            </div>
          </form>
        </>
      ) : (
        <div className="flex flex-1 flex-col">
          <h1 className="sr-only">Повідомлення</h1>
          <p className="px-5 py-10 text-sm text-[#032048]/50">Оберіть діалог</p>
        </div>
      )}
    </section>
  );
};
