import type { FC } from 'react';
import { Link } from 'react-router';
import type { Store } from '@/entities/store';
import type { StoreAction } from '@/pages/Discover/model/types.ts';
import { StoreActions } from '@/pages/Discover/ui/StoreActions.tsx';

type StoreListItemProps = {
  store: Store;
  isPending: (action: StoreAction) => boolean;
  onLike: () => void;
  onFavorite: () => void;
  onSubscribe: () => void;
};

export const StoreListItem: FC<StoreListItemProps> = ({
  store,
  isPending,
  onLike,
  onFavorite,
  onSubscribe,
}) => {
  return (
    <article className="relative flex items-center gap-4 rounded-[22px] bg-white p-3 sm:gap-5 sm:pr-6">
      <Link
        to={`/s/${store.id}`}
        aria-label={store.name}
        className="absolute inset-0 z-0 rounded-[22px]"
      />
      <img
        src={store.imageUrl}
        alt=""
        className="h-[92px] w-[120px] shrink-0 rounded-2xl object-cover sm:h-[108px] sm:w-[168px]"
      />
      <div className="flex min-w-0 flex-col gap-2.5 py-1">
        <div>
          <h3 className="text-[15px] font-semibold leading-tight">{store.name}</h3>
          <p className="mt-1 text-[13px] text-[#032048]/55">{store.description}</p>
        </div>
        <div className="relative z-10">
          <StoreActions
            store={store}
            isPending={isPending}
            onLike={onLike}
            onFavorite={onFavorite}
            onSubscribe={onSubscribe}
          />
        </div>
      </div>
    </article>
  );
};
