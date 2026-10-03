import type { FC } from 'react';
import { Trash2 } from 'lucide-react';
import type { InboxConversation, InboxStoreFilter } from '@/entities/inbox';
import { inboxAvatarClassName } from '@/pages/Messages/ui/inboxAvatar.ts';

type ConversationListProps = {
  filters: InboxStoreFilter[];
  storeId: string;
  conversations: InboxConversation[];
  selectedId: string | null;
  threadOpen: boolean;
  deletingId: string | null;
  onStoreChange: (storeId: string) => void;
  onSelect: (conversationId: string) => void;
  onDelete: (conversationId: string) => void;
};

export const ConversationList: FC<ConversationListProps> = ({
  filters,
  storeId,
  conversations,
  selectedId,
  threadOpen,
  deletingId,
  onStoreChange,
  onSelect,
  onDelete,
}) => {
  return (
    <aside
      className={`min-h-0 w-full shrink-0 flex-col overflow-hidden rounded-[20px] bg-[#FBF8F1] lg:flex lg:w-[380px] lg:flex-none ${
        threadOpen ? 'hidden' : 'flex flex-1'
      }`}
    >
      <div role="radiogroup" aria-label="Магазин" className="flex flex-wrap gap-2 px-4 pt-4 pb-2">
        {filters.map((filter) => {
          const active = filter.id === storeId;
          return (
            <button
              key={filter.id}
              type="button"
              role="radio"
              aria-checked={active}
              className={`h-8 cursor-pointer rounded-full px-3.5 text-[13px] font-medium transition-colors ${
                active ? 'bg-[#032048] text-white' : 'bg-[#EFE6D8] text-[#032048] hover:bg-[#E7DCCB]'
              }`}
              onClick={() => onStoreChange(filter.id)}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <div role="listbox" aria-label="Діалоги" className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-3 pt-1 pb-3">
        {conversations.length === 0 ? (
          <p className="px-3 py-8 text-center text-sm text-[#032048]/50">Немає діалогів</p>
        ) : (
          conversations.map((conversation) => {
            const selected = conversation.id === selectedId;
            const deleting = deletingId === conversation.id;
            return (
              <div
                key={conversation.id}
                role="option"
                aria-selected={selected}
                className={`flex w-full items-center gap-1 rounded-2xl pr-1 transition-colors ${
                  selected ? 'bg-[#F3EBDD]' : 'hover:bg-[#F3EBDD]/70'
                }`}
              >
                <button
                  type="button"
                  className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 px-3 py-3 text-left"
                  onClick={() => onSelect(conversation.id)}
                >
                  <span
                    aria-hidden="true"
                    className={`h-10 w-10 shrink-0 rounded-full ${inboxAvatarClassName[conversation.avatar]}`}
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-[14px] leading-tight font-semibold text-[#032048]">
                      {conversation.title}
                    </span>
                    <span className="mt-1 block truncate text-[13px] leading-tight text-[#032048]/45">
                      {conversation.preview}
                    </span>
                  </span>
                </button>
                <button
                  type="button"
                  aria-label={`Видалити діалог ${conversation.title}`}
                  disabled={deleting}
                  className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-full text-[#032048]/40 hover:bg-white hover:text-[#C4564E] disabled:cursor-default disabled:opacity-60"
                  onClick={() => onDelete(conversation.id)}
                >
                  <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
};
