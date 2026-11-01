import type { FC } from 'react';
import { Link } from 'react-router';
import type { ProfileStoreCard } from '@/entities/profile';

type ProfileStoreListProps = {
  stores: ProfileStoreCard[];
  isMine: boolean;
};

const actionClass =
  'inline-flex h-8 cursor-pointer items-center rounded-full px-2.5 text-xs font-semibold transition-colors';

export const ProfileStoreList: FC<ProfileStoreListProps> = ({ stores, isMine }) => {
  if (stores.length === 0) {
    return (
      <p className="mx-3.5 mt-3.5 rounded-[20px] bg-[#FFFBF5] px-5 py-10 text-center text-sm text-[#032048]/60 lg:mx-[22px]">
        Магазинів ще немає
      </p>
    );
  }

  return (
    <div
      className={`mx-3.5 mt-3.5 grid gap-2 lg:mx-[22px] lg:gap-3.5 ${
        stores.length === 1 ? 'lg:max-w-[640px]' : 'lg:grid-cols-2'
      }`}
    >
      {stores.map((store) => (
        <article
          key={store.id}
          className="grid grid-cols-[72px_1fr] items-center gap-2.5 rounded-[14px] border border-[#E4D8C8] bg-[#FFFBF5] p-2 lg:grid-cols-[168px_1fr] lg:items-stretch lg:gap-0 lg:overflow-hidden lg:rounded-2xl lg:p-0"
        >
          <Link
            to={`/s/${store.id}`}
            aria-label={store.name}
            className="block h-[72px] w-[72px] overflow-hidden rounded-[10px] lg:h-full lg:w-full lg:rounded-none"
          >
            <img src={store.imageUrl} alt="" className="h-full w-full object-cover lg:h-[156px]" />
          </Link>
          <div className="flex min-w-0 flex-col gap-1 lg:p-3.5">
            <Link to={`/s/${store.id}`} className="text-[15px] font-semibold text-[#032048] lg:text-lg">
              {store.name}
            </Link>
            <p className="text-xs text-[#6F675C]">{store.summary}</p>
            <div className="mt-1 flex flex-wrap gap-1.5 lg:mt-auto">
              <Link
                to={`/s/${store.id}`}
                className={`${actionClass} ${
                  isMine
                    ? 'border border-[#E4D8C8] bg-[#FFFBF5] text-[#032048] hover:bg-[#F7F3EC]'
                    : 'bg-[#032048] text-[#F6F0E4] hover:bg-[#0A3268]'
                }`}
              >
                {isMine ? 'Сторінка' : 'Сторінка стора'}
              </Link>
              {isMine && (
                <button
                  type="button"
                  className={`${actionClass} border border-[#E4D8C8] bg-[#FFFBF5] text-[#032048] hover:bg-[#F7F3EC]`}
                >
                  Пульт
                </button>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};
