import type { FC } from 'react';
import type { Store } from '@/entities/store';
import type { StoreAction } from '@/pages/Discover/model/types.ts';

type StoreActionsProps = {
  store: Store;
  isPending: (action: StoreAction) => boolean;
  onLike: () => void;
  onFavorite: () => void;
  onSubscribe: () => void;
};

const pill =
  'inline-flex h-8 cursor-pointer items-center rounded-full px-3 text-[13px] font-medium transition-colors disabled:cursor-default disabled:opacity-60';

export const StoreActions: FC<StoreActionsProps> = ({
  store,
  isPending,
  onLike,
  onFavorite,
  onSubscribe,
}) => {
  const likeLabel = store.likesCount > 0 ? `Лайк ${store.likesCount}` : 'Лайк';

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        className={`${pill} ${store.isLiked ? 'bg-[#F8E4E0] text-[#C45C54]' : 'bg-[#F3EFE8] text-[#032048] hover:bg-[#E8E2D8]'}`}
        aria-pressed={store.isLiked}
        disabled={isPending('like')}
        onClick={(event) => {
          event.stopPropagation();
          onLike();
        }}
      >
        {likeLabel}
      </button>
      <button
        type="button"
        className={`${pill} ${store.isFavorite ? 'bg-[#032048] text-white' : 'bg-[#F3EFE8] text-[#032048] hover:bg-[#E8E2D8]'}`}
        aria-pressed={store.isFavorite}
        disabled={isPending('favorite')}
        onClick={(event) => {
          event.stopPropagation();
          onFavorite();
        }}
      >
        {store.isFavorite ? 'В обраному' : 'Обране'}
      </button>
      <button
        type="button"
        className={`${pill} ${store.isSubscribed ? 'bg-[#032048] text-white' : 'bg-[#F3EFE8] text-[#032048] hover:bg-[#E8E2D8]'}`}
        aria-pressed={store.isSubscribed}
        disabled={isPending('subscribe')}
        onClick={(event) => {
          event.stopPropagation();
          onSubscribe();
        }}
      >
        {store.isSubscribed ? 'Підписані' : 'Підписка'}
      </button>
    </div>
  );
};
