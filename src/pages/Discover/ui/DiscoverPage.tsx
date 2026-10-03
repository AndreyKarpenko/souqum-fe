import { useState, type FC } from 'react';
import type { Store } from '@/entities/store';
import type { StoreAction } from '@/pages/Discover/model/types.ts';
import { useDiscover } from '@/pages/Discover/model/useDiscover.ts';
import type { DiscoverLayout } from '@/pages/Discover/model/types.ts';
import { StoreCard } from '@/pages/Discover/ui/StoreCard.tsx';
import { StoreListItem } from '@/pages/Discover/ui/StoreListItem.tsx';

const viewOptions: { id: DiscoverLayout; label: string }[] = [
  { id: 'grid', label: 'Плитка' },
  { id: 'wide', label: 'На всю ширину' },
];

export const DiscoverPage: FC = () => {
  const {
    popular,
    stores,
    categories,
    category,
    setCategory,
    status,
    listStatus,
    actionError,
    reload,
    toggle,
    isPending,
  } = useDiscover();
  const [layout, setLayout] = useState<DiscoverLayout>('wide');

  if (status === 'loading') return <DiscoverSkeleton />;

  if (status === 'error') {
    return (
      <div className="rounded-[20px] bg-white px-6 py-12 text-center">
        <p className="text-sm text-[#032048]">Не вдалося завантажити магазини</p>
        <button
          type="button"
          className="mt-4 h-10 rounded-full bg-[#032048] px-5 text-sm font-medium text-white"
          onClick={reload}
        >
          Спробувати ще раз
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="sr-only">Discover</h1>
      <section className="flex flex-col gap-4">
        <h2 className="text-[17px] font-semibold">Популярне</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {popular.map((store) => (
            <StoreCard
              key={store.id}
              store={store}
              isPending={(action) => isPending(store.id, action)}
              onLike={() => void toggle(store, 'like')}
              onFavorite={() => void toggle(store, 'favorite')}
              onSubscribe={() => void toggle(store, 'subscribe')}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-[17px] font-semibold">Усі магазини</h2>
          <div role="radiogroup" aria-label="Вигляд списку" className="flex gap-2">
            {viewOptions.map((option) => {
              const active = layout === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  className={`h-9 cursor-pointer rounded-full px-4 text-sm font-medium transition-colors ${
                    active ? 'bg-[#032048] text-white' : 'bg-[#E7E1D8] text-[#032048]/75 hover:bg-[#DDD6CC]'
                  }`}
                  onClick={() => setLayout(option.id)}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <div role="radiogroup" aria-label="Категорія" className="flex flex-wrap gap-2">
          {categories.map((item) => {
            const active = category === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="radio"
                aria-checked={active}
                className={`h-9 cursor-pointer rounded-full px-4 text-sm transition-colors ${
                  active
                    ? 'bg-white font-semibold text-[#032048] shadow-[0_1px_2px_rgba(3,32,72,0.08)]'
                    : 'font-medium text-[#032048]/75 hover:bg-white/70'
                }`}
                onClick={() => setCategory(item.id)}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {actionError && <p className="text-sm text-[#C4564E]">{actionError}</p>}
        {listStatus === 'error' && (
          <p className="text-sm text-[#C4564E]">Не вдалося оновити список</p>
        )}

        <div
          className={listStatus === 'loading' ? 'opacity-60 transition-opacity' : 'transition-opacity'}
          aria-busy={listStatus === 'loading'}
        >
          {stores.length === 0 ? (
            <p className="rounded-[20px] bg-white px-5 py-10 text-center text-sm text-[#032048]/60">
              У цій категорії поки немає магазинів
            </p>
          ) : layout === 'grid' ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {stores.map((store) => (
                <CatalogCard key={store.id} store={store} isPending={isPending} toggle={toggle} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {stores.map((store) => (
                <StoreListItem
                  key={store.id}
                  store={store}
                  isPending={(action) => isPending(store.id, action)}
                  onLike={() => void toggle(store, 'like')}
                  onFavorite={() => void toggle(store, 'favorite')}
                  onSubscribe={() => void toggle(store, 'subscribe')}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const CatalogCard: FC<{
  store: Store;
  isPending: (storeId: string, action: StoreAction) => boolean;
  toggle: (store: Store, action: StoreAction) => Promise<void>;
}> = ({ store, isPending, toggle }) => (
  <StoreCard
    store={store}
    isPending={(action) => isPending(store.id, action)}
    onLike={() => void toggle(store, 'like')}
    onFavorite={() => void toggle(store, 'favorite')}
    onSubscribe={() => void toggle(store, 'subscribe')}
  />
);

const DiscoverSkeleton: FC = () => (
  <div className="flex flex-col gap-8" aria-busy="true" aria-label="Завантаження магазинів">
    <div className="flex flex-col gap-4">
      <div className="h-5 w-28 animate-pulse rounded-full bg-white/80" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="h-64 animate-pulse rounded-[20px] bg-white/80" />
        ))}
      </div>
    </div>
    <div className="flex flex-col gap-3">
      <div className="h-5 w-36 animate-pulse rounded-full bg-white/80" />
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="h-32 animate-pulse rounded-[22px] bg-white/80" />
      ))}
    </div>
  </div>
);
