import { useEffect, useRef, useState, type FC } from 'react';
import { Camera } from 'lucide-react';
import { Link, useParams } from 'react-router';
import { getMyProfileThunk } from '@/entities/user';
import type { SocialProfile } from '@/entities/profile';
import { useThunkDispatch } from '@/shared/lib/useThunkDispatch.ts';
import { readImageFile, useProfile } from '@/pages/Profile/model/useProfile.ts';
import { ProfileComposer } from '@/pages/Profile/ui/ProfileComposer.tsx';
import { ProfileGallery, ProfileNote } from '@/pages/Profile/ui/ProfileGallery.tsx';
import { ProfileStoreList } from '@/pages/Profile/ui/ProfileStoreList.tsx';

type ProfileTab = 'posts' | 'shelf' | 'stores';

const tabs: { id: ProfileTab; label: string }[] = [
  { id: 'posts', label: 'Пости' },
  { id: 'shelf', label: 'Полиця' },
  { id: 'stores', label: 'Магазини' },
];

const storesLabel = (count: number) => {
  const mod100 = Math.abs(count) % 100;
  const mod10 = mod100 % 10;
  if (mod100 > 10 && mod100 < 20) return 'магазинів';
  if (mod10 === 1) return 'магазин';
  if (mod10 >= 2 && mod10 <= 4) return 'магазини';
  return 'магазинів';
};

type DraftState = {
  profileId: string;
  text: string;
  imageUrl: string;
  imageAlt: string;
};

const pill =
  'inline-flex h-9 cursor-pointer items-center justify-center rounded-full px-4 text-sm font-semibold transition-colors disabled:cursor-default disabled:opacity-60';

const goldPill = `${pill} bg-[#E8A317] text-[#032048] hover:bg-[#D99612]`;
const outlinePill = `${pill} border border-[#E4D8C8] bg-[#FFFBF5] text-[#032048] hover:bg-[#F7F3EC]`;

const fileError = (error: unknown) => {
  if (error instanceof Error && error.message === 'size') return 'Оберіть фото до 2 МБ';
  if (error instanceof Error && error.message === 'type') return 'Оберіть файл зображення';
  return 'Не вдалося прочитати фото';
};

const focusDraft = () => {
  const fields = document.querySelectorAll<HTMLElement>('[data-profile-draft]');
  const visible = [...fields].find((field) => field.getClientRects().length > 0);
  visible?.focus();
};

export const ProfileScreen: FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useThunkDispatch();
  const {
    profile,
    status,
    actionError,
    pending,
    reload,
    publish,
    setShelfPublic,
    toggleFollow,
    updateAvatar,
  } = useProfile(id);
  const [tab, setTab] = useState<ProfileTab>('posts');
  const [draftOverride, setDraftOverride] = useState<DraftState | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [focusComposer, setFocusComposer] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const draftInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    void dispatch(getMyProfileThunk());
  }, [dispatch, profile?.avatarUrl]);

  useEffect(() => {
    setTab('posts');
    setFormError(null);
    setDraftOverride(null);
  }, [id]);

  useEffect(() => {
    if (!focusComposer || tab !== 'posts') return;
    focusDraft();
    setFocusComposer(false);
  }, [focusComposer, tab]);

  if (status === 'loading') return <ProfileSkeleton />;

  if (status === 'missing') {
    return (
      <div className="rounded-[20px] bg-white px-6 py-12 text-center">
        <p className="text-sm text-[#032048]">Профіль не знайдено</p>
        <Link
          to="/profile"
          className="mt-4 inline-flex h-10 items-center rounded-full bg-[#032048] px-5 text-sm font-medium text-white"
        >
          До свого профілю
        </Link>
      </div>
    );
  }

  if (status === 'error' || !profile) {
    return (
      <div className="rounded-[20px] bg-white px-6 py-12 text-center">
        <p className="text-sm text-[#032048]">Не вдалося завантажити профіль</p>
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

  const shownError = formError ?? actionError;
  const aside = tab === 'shelf' ? profile.shelfAside : profile.postsAside;
  const shelfHidden = tab === 'shelf' && !profile.isMine && !profile.shelfPublic;
  const draft: DraftState | null =
    draftOverride?.profileId === profile.id
      ? draftOverride
      : profile.draft
        ? {
            profileId: profile.id,
            text: profile.draft.text,
            imageUrl: profile.draft.imageUrl,
            imageAlt: profile.draft.imageAlt,
          }
        : null;

  const updateDraft = (patch: Partial<Pick<DraftState, 'text' | 'imageUrl' | 'imageAlt'>>) => {
    if (!draft) return;
    setDraftOverride({ ...draft, ...patch });
  };

  const onNewPost = () => {
    setTab('posts');
    setFocusComposer(true);
  };

  const onPublish = async () => {
    const text = draft?.text.trim() ?? '';
    if (!text) {
      setFormError('Напишіть текст поста');
      return;
    }
    if (!draft?.imageUrl) {
      setFormError('Додайте фото');
      return;
    }
    setFormError(null);
    const published = await publish(text, draft.imageUrl);
    if (!published) return;
    setDraftOverride(null);
    document.getElementById('profile-gallery')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  const onDraftFile = async (file: File) => {
    try {
      const imageUrl = await readImageFile(file);
      updateDraft({ imageUrl, imageAlt: 'Нове фото' });
      setFormError(null);
    } catch (error: unknown) {
      setFormError(fileError(error));
    }
  };

  const onAvatarFile = async (file: File) => {
    try {
      setFormError(null);
      const imageUrl = await readImageFile(file);
      await updateAvatar(imageUrl);
    } catch (error: unknown) {
      setFormError(fileError(error));
    }
  };

  const composer =
    profile.isMine && draft ? (
      <ProfileComposer
        variant="card"
        initial={profile.initial}
        text={draft.text}
        imageUrl={draft.imageUrl}
        imageAlt={draft.imageAlt}
        pending={pending}
        onTextChange={(text) => updateDraft({ text })}
        onPickImage={() => draftInputRef.current?.click()}
        onPublish={() => void onPublish()}
      />
    ) : null;

  return (
    <div className="-mx-4 -mt-4 pb-8 lg:-mx-8 lg:-mt-6">
      {profile.isMine && (
        <>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            aria-label="Файл аватара"
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = '';
              if (file) void onAvatarFile(file);
            }}
          />
          <input
            ref={draftInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            aria-label="Фото поста"
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = '';
              if (file) void onDraftFile(file);
            }}
          />
        </>
      )}

      <img src={profile.coverUrl} alt={profile.coverAlt} className="h-[132px] w-full object-cover lg:h-[176px]" />

      <div className="relative z-10 -mt-7 flex items-end gap-3 px-3.5 lg:-mt-12 lg:gap-4 lg:px-[22px]">
        <Avatar profile={profile} onChange={() => avatarInputRef.current?.click()} />
        <div className="min-w-0 flex-1 pb-1">
          <h1 className="text-[22px] leading-tight font-bold tracking-tight lg:text-[28px]">
            {profile.firstName} {profile.lastName}
          </h1>
          <p className="mt-0.5 text-[13px] text-[#6F675C]">
            {[`@${profile.handle}`, profile.city].filter(Boolean).join(' · ')}
          </p>
          <p className="mt-1 hidden max-w-[460px] text-sm text-[#1C2433] lg:block">{profile.bio}</p>
        </div>
        <div className="mb-1.5 hidden shrink-0 lg:block">
          <ProfileActions
            profile={profile}
            pending={pending}
            onNewPost={onNewPost}
            onAvatar={() => avatarInputRef.current?.click()}
            onFollow={() => void toggleFollow()}
          />
        </div>
      </div>

      <div className="mx-3.5 mt-3 flex rounded-[14px] border border-[#E4D8C8] bg-[#FFFBF5] px-1 py-2 lg:mx-[22px] lg:mt-3.5 lg:gap-7 lg:px-[18px] lg:py-2.5">
        <Stat value={profile.postsCount} label="пости" />
        <Stat value={profile.followersCount} label="підписники" />
        <Stat value={profile.stores.length} label={storesLabel(profile.stores.length)} />
      </div>

      <p className="mt-2.5 px-3.5 text-sm text-[#1C2433] lg:hidden">{profile.bioShort}</p>

      {profile.isMine && tab === 'posts' && draft && (
        <div className="mt-2.5 lg:hidden">
          <ProfileComposer
            variant="bar"
            initial={profile.initial}
            text={draft.text}
            imageUrl={draft.imageUrl}
            imageAlt={draft.imageAlt}
            pending={pending}
            onTextChange={(text) => updateDraft({ text })}
            onPickImage={() => draftInputRef.current?.click()}
            onPublish={() => void onPublish()}
          />
        </div>
      )}

      <div className="mt-2.5 px-3.5 lg:hidden">
        <ProfileActions
          profile={profile}
          pending={pending}
          wide
          onNewPost={onNewPost}
          onAvatar={() => avatarInputRef.current?.click()}
          onFollow={() => void toggleFollow()}
        />
      </div>

      <div role="tablist" aria-label="Розділи профілю" className="mx-3.5 mt-3 flex border-b border-[#E4D8C8] lg:mx-[22px]">
        {tabs.map((item) => {
          const selected = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={selected}
              className={`mb-[-1px] flex-1 cursor-pointer border-b-2 px-2 py-2 text-[13px] font-bold lg:flex-none lg:px-3.5 lg:text-sm ${
                selected ? 'border-[#032048] text-[#032048]' : 'border-transparent text-[#6F675C]'
              }`}
              onClick={() => setTab(item.id)}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {shownError && <p className="px-3.5 pt-3 text-sm text-[#C4564E] lg:px-[22px]">{shownError}</p>}

      {tab === 'stores' ? (
        <ProfileStoreList stores={profile.stores} isMine={profile.isMine} />
      ) : (
        <div className="mt-3 lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start lg:gap-3.5 lg:px-[22px]">
          <div className="hidden lg:block">
            <ProfileNote title={aside.title} text={aside.text}>
              {tab === 'posts' ? composer : null}
              {tab === 'shelf' && profile.isMine && (
                <ShelfSwitch
                  checked={profile.shelfPublic}
                  pending={pending}
                  onToggle={() => void setShelfPublic(!profile.shelfPublic)}
                />
              )}
            </ProfileNote>
          </div>
          <div>
            {tab === 'shelf' && profile.isMine && (
              <div className="mx-3.5 mb-3 rounded-[14px] border border-[#E4D8C8] bg-[#FFFBF5] px-3.5 lg:hidden">
                <ShelfSwitch
                  checked={profile.shelfPublic}
                  pending={pending}
                  onToggle={() => void setShelfPublic(!profile.shelfPublic)}
                />
              </div>
            )}
            {shelfHidden ? (
              <p className="mx-3.5 rounded-[20px] bg-[#FFFBF5] px-5 py-10 text-center text-sm text-[#032048]/60 lg:mx-0">
                Полицю приховано
              </p>
            ) : (
              <ProfileGallery
                items={
                  tab === 'posts'
                    ? profile.posts.map((post) => ({
                        id: post.id,
                        title: post.title,
                        imageUrl: post.imageUrl,
                        alt: post.alt,
                        attribution: post.attribution,
                      }))
                    : profile.shelf.map((item) => ({
                        id: item.id,
                        title: item.title,
                        imageUrl: item.imageUrl,
                        alt: item.alt,
                        attribution: 'обране',
                        href: item.href,
                      }))
                }
                emptyLabel={tab === 'posts' ? 'Постів ще немає' : 'На полиці ще нічого немає'}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const Avatar: FC<{ profile: SocialProfile; onChange: () => void }> = ({ profile, onChange }) => (
  <div className="relative h-[84px] w-[84px] shrink-0 lg:h-[104px] lg:w-[104px]">
    {profile.avatarUrl ? (
      <img
        src={profile.avatarUrl}
        alt=""
        className="h-full w-full rounded-full border-[3px] border-[#F6F0E4] object-cover shadow-[0_10px_28px_rgba(3,32,72,0.08)] lg:border-4"
      />
    ) : (
      <div className="grid h-full w-full place-items-center rounded-full border-[3px] border-[#F6F0E4] bg-[#032048] text-[32px] font-bold text-[#E8A317] shadow-[0_10px_28px_rgba(3,32,72,0.08)] lg:border-4 lg:text-[40px]">
        {profile.initial}
      </div>
    )}
    {profile.isMine && (
      <button
        type="button"
        aria-label="Змінити аватар"
        className="absolute -right-0.5 -bottom-0.5 grid h-[26px] w-[26px] cursor-pointer place-items-center rounded-full border-2 border-[#F6F0E4] bg-[#FFFBF5] text-[#032048] shadow-[0_10px_28px_rgba(3,32,72,0.08)] lg:h-8 lg:w-8"
        onClick={onChange}
      >
        <Camera className="h-3.5 w-3.5" strokeWidth={1.8} />
      </button>
    )}
  </div>
);

const Stat: FC<{ value: number; label: string }> = ({ value, label }) => (
  <div className="flex-1 text-center lg:flex-none lg:text-left">
    <b className="block text-base font-bold tracking-tight tabular-nums lg:text-lg">{value}</b>
    <span className="text-[11px] text-[#6F675C] lg:text-xs">{label}</span>
  </div>
);

const ProfileActions: FC<{
  profile: SocialProfile;
  pending: boolean;
  wide?: boolean;
  onNewPost: () => void;
  onAvatar: () => void;
  onFollow: () => void;
}> = ({ profile, pending, wide, onNewPost, onAvatar, onFollow }) => (
  <div className={`flex flex-wrap gap-2 ${wide ? '[&>button]:flex-1 [&>a]:flex-1' : 'justify-end'}`}>
    {profile.isMine ? (
      <>
        <button type="button" className={goldPill} onClick={onNewPost}>
          Новий пост
        </button>
        <button type="button" className={outlinePill} onClick={onAvatar}>
          Змінити аватар
        </button>
      </>
    ) : (
      <>
        <button
          type="button"
          className={goldPill}
          aria-pressed={profile.isFollowing}
          disabled={pending}
          onClick={onFollow}
        >
          {profile.isFollowing ? 'Підписані' : 'Підписатися'}
        </button>
        <Link to="/messages" className={outlinePill}>
          Написати
        </Link>
      </>
    )}
  </div>
);

const ShelfSwitch: FC<{ checked: boolean; pending: boolean; onToggle: () => void }> = ({
  checked,
  pending,
  onToggle,
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    disabled={pending}
    className="mt-2 flex w-full cursor-pointer items-center justify-between gap-3 border-b border-[#E4D8C8] py-2 text-left text-sm text-[#032048] disabled:cursor-default disabled:opacity-60"
    onClick={onToggle}
  >
    <span>Показувати іншим</span>
    <span className={`relative h-[22px] w-9 shrink-0 rounded-full ${checked ? 'bg-[#032048]' : 'bg-[#D9CFC2]'}`}>
      <span
        className={`absolute top-[3px] h-4 w-4 rounded-full ${
          checked ? 'right-[3px] bg-[#E8A317]' : 'left-[3px] bg-white'
        }`}
      />
    </span>
  </button>
);

const ProfileSkeleton: FC = () => (
  <div className="-mx-4 -mt-4 lg:-mx-8 lg:-mt-6" aria-busy="true" aria-label="Завантаження профілю">
    <div className="h-[132px] animate-pulse bg-white/80 lg:h-[176px]" />
    <div className="flex items-end gap-3 px-3.5 lg:px-[22px]">
      <div className="-mt-7 h-[84px] w-[84px] animate-pulse rounded-full bg-white lg:-mt-12 lg:h-[104px] lg:w-[104px]" />
      <div className="mb-2 flex flex-col gap-2">
        <div className="h-7 w-40 animate-pulse rounded-full bg-white/80" />
        <div className="h-4 w-28 animate-pulse rounded-full bg-white/80" />
      </div>
    </div>
    <div className="mx-3.5 mt-4 h-14 animate-pulse rounded-[14px] bg-white/80 lg:mx-[22px]" />
    <div className="mt-4 grid grid-cols-3 gap-[3px]">
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="h-24 animate-pulse bg-white/80 lg:h-[200px]" />
      ))}
    </div>
  </div>
);

export default ProfileScreen;
