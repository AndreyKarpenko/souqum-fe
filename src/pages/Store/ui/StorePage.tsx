import type { FC } from 'react';
import { Link, useParams } from 'react-router';
import type { StoreAvatarTone, StoreProfile } from '@/entities/store';
import { useStore } from '@/pages/Store/model/useStore.ts';
import { StorePostCard } from '@/pages/Store/ui/StorePostCard.tsx';

const host = window.location.host;

const avatarToneClass: Record<StoreAvatarTone, string> = {
  warm: 'bg-gradient-to-br from-[#4A2A14] to-[#E8943A]',
  clay: 'bg-gradient-to-br from-[#6B3A2A] to-[#D7A07A]',
  green: 'bg-gradient-to-br from-[#1F4D3A] to-[#7DAB6A]',
  linen: 'bg-gradient-to-br from-[#C4B39A] to-[#EFE6D6]',
  wool: 'bg-gradient-to-br from-[#3E4C59] to-[#A9B7C4]',
  oak: 'bg-gradient-to-br from-[#5C4030] to-[#C4A574]',
  paper: 'bg-gradient-to-br from-[#8C8378] to-[#E7E1D6]',
  honey: 'bg-gradient-to-br from-[#C47B1A] to-[#F3D48A]',
  navy: 'bg-gradient-to-br from-[#032048] to-[#5C7AB5]',
};

const pill =
  'inline-flex h-9 cursor-pointer items-center rounded-full px-4 text-sm font-medium transition-colors disabled:cursor-default disabled:opacity-60';

export const StorePage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { profile, status, actionError, pending, reload, toggleSubscription } = useStore(id);

  if (status === 'loading') return <StoreSkeleton />;

  if (status === 'missing') {
    return (
      <div className="rounded-[20px] bg-white px-6 py-12 text-center">
        <p className="text-sm text-[#032048]">Магазин не знайдено</p>
        <Link
          to="/discover"
          className="mt-4 inline-flex h-10 items-center rounded-full bg-[#032048] px-5 text-sm font-medium text-white"
        >
          До магазинів
        </Link>
      </div>
    );
  }

  if (status === 'error' || !profile) {
    return (
      <div className="rounded-[20px] bg-white px-6 py-12 text-center">
        <p className="text-sm text-[#032048]">Не вдалося завантажити магазин</p>
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

  return (
    <div className="flex flex-col gap-7">
      <StoreHeader
        profile={profile}
        pending={pending}
        actionError={actionError}
        onToggleSubscription={() => void toggleSubscription()}
      />
      {profile.posts.length === 0 ? (
        <p className="rounded-[20px] bg-white px-5 py-10 text-center text-sm text-[#032048]/60">
          У магазину ще немає публікацій
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {profile.posts.map((post) => (
            <StorePostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

const StoreHeader: FC<{
  profile: StoreProfile;
  pending: boolean;
  actionError: string | null;
  onToggleSubscription: () => void;
}> = ({ profile, pending, actionError, onToggleSubscription }) => {
  const address = `${host}/s/${profile.id}`.toUpperCase();

  return (
    <header className="flex flex-col gap-4">
      <p className="text-[11px] font-medium tracking-[0.08em] text-[#032048]/45 uppercase">{address}</p>
      <div className="flex items-center gap-4">
        <span
          className={`h-16 w-16 shrink-0 rounded-2xl ${avatarToneClass[profile.avatarTone]}`}
          aria-hidden="true"
        />
        <div className="min-w-0">
          <h1 className="text-[28px] leading-tight font-bold tracking-tight">{profile.name}</h1>
          <p className="mt-1 text-sm text-[#032048]/60">{profile.bio}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={`${pill} ${
            profile.isSubscribed
              ? 'bg-[#E8A317] text-[#032048] hover:bg-[#D99612]'
              : 'bg-white text-[#032048] shadow-[0_1px_2px_rgba(3,32,72,0.06)] hover:bg-[#F7F3EC]'
          }`}
          aria-pressed={profile.isSubscribed}
          disabled={pending}
          onClick={onToggleSubscription}
        >
          {profile.isSubscribed ? 'Підписані' : 'Підписатися'}
        </button>
        <Link
          to={`/messages?store=${profile.id}`}
          className={`${pill} bg-white text-[#032048] shadow-[0_1px_2px_rgba(3,32,72,0.06)] hover:bg-[#F7F3EC]`}
        >
          Написати
        </Link>
        {profile.storefrontUrl ? (
          <a
            href={profile.storefrontUrl}
            target="_blank"
            rel="noreferrer"
            className={`${pill} bg-[#032048] text-white hover:bg-[#0A3268]`}
          >
            Відкрити вітрину
          </a>
        ) : (
          <button type="button" className={`${pill} bg-[#032048] text-white`} disabled>
            Відкрити вітрину
          </button>
        )}
      </div>
      {actionError && <p className="text-sm text-[#C4564E]">{actionError}</p>}
    </header>
  );
};

const StoreSkeleton: FC = () => (
  <div className="flex flex-col gap-7" aria-busy="true" aria-label="Завантаження магазину">
    <div className="h-3 w-56 animate-pulse rounded-full bg-white/80" />
    <div className="flex items-center gap-4">
      <div className="h-16 w-16 animate-pulse rounded-2xl bg-white/80" />
      <div className="flex flex-col gap-2">
        <div className="h-7 w-40 animate-pulse rounded-full bg-white/80" />
        <div className="h-4 w-72 max-w-full animate-pulse rounded-full bg-white/80" />
      </div>
    </div>
    <div className="flex gap-2">
      <div className="h-9 w-28 animate-pulse rounded-full bg-white/80" />
      <div className="h-9 w-24 animate-pulse rounded-full bg-white/80" />
      <div className="h-9 w-36 animate-pulse rounded-full bg-white/80" />
    </div>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className="h-72 animate-pulse rounded-[20px] bg-white/80" />
      ))}
    </div>
  </div>
);
