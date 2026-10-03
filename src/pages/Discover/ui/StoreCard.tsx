import type { FC } from 'react';
import { Link } from 'react-router';
import type { Store } from '@/entities/store';
import type { StoreAction } from '@/pages/Discover/model/types.ts';
import { StoreActions } from '@/pages/Discover/ui/StoreActions.tsx';

type StoreCardProps = {
  store: Store;
  isPending: (action: StoreAction) => boolean;
  onLike: () => void;
  onFavorite: () => void;
  onSubscribe: () => void;
};

export const StoreCard: FC<StoreCardProps> = ({
  store,
  isPending,
  onLike,
  onFavorite,
  onSubscribe,
}) => {
  return (
    <article className="relative flex h-full flex-col rounded-[20px] bg-white">
      <Link
        to={`/s/${store.id}`}
        aria-label={store.name}
        className="absolute inset-0 z-0 rounded-[20px]"
      />
      <img src={store.imageUrl} alt="" className="aspect-[16/10] w-full rounded-t-[20px] object-cover" />
      <div className="px-4 pt-4 text-left">
        <h3 className="text-[15px] font-semibold leading-tight">{store.name}</h3>
        <p className="mt-1 text-[13px] font-normal text-[#032048]/55">{store.description}</p>
      </div>
      <div className="relative z-10 px-4 pt-3 pb-4">
        <StoreActions
          store={store}
          isPending={isPending}
          onLike={onLike}
          onFavorite={onFavorite}
          onSubscribe={onSubscribe}
        />
      </div>
    </article>
  );
};
