import type { GenericAbortSignal } from 'axios';
import type { StoreAvatarTone, StorePost, StoreProfile } from '@/entities/store/model/types.ts';
import roast from '@/pages/Landing/assets/content-roast.png';
import cup from '@/pages/Landing/assets/content-cup.png';
import delivery from '@/pages/Landing/assets/content-delivery.png';
import { readStoreDto } from '@/shared/api/mock/discoverMock.ts';

type StoreMockResult = {
  status: number;
  data: unknown;
};

type StoreProfileExtra = {
  bio: string;
  avatarTone: StoreAvatarTone;
  storefrontUrl: string | null;
  conversationId: string | null;
  posts: StorePost[];
};

const tones: Record<string, StoreAvatarTone> = {
  'cool-coffee': 'warm',
  keramos: 'clay',
  'green-room': 'green',
  'linen-atelier': 'linen',
  'north-loom': 'wool',
  'salt-oak': 'oak',
  'paper-boat': 'paper',
  'honey-field': 'honey',
};

const conversations: Record<string, string> = {
  'cool-coffee': 'maria-cool-coffee',
  keramos: 'igor-keramos',
  'linen-atelier': 'linen-atelier',
};

const coolCoffeePosts: StorePost[] = [
  {
    id: 'spring-roast',
    title: 'Весняна обжарка',
    imageUrl: roast,
    alt: 'Два пакети кави та зерна',
    caption: null,
    tags: ['Ефіопія Гуджі', 'Кенія'],
    media: 'image',
  },
  {
    id: 'new-cup',
    title: 'Нова чашка',
    imageUrl: cup,
    alt: 'Чашка кави на блюдці',
    caption: 'відео колекції',
    tags: [],
    media: 'video',
  },
  {
    id: 'march-delivery',
    title: 'Поставка березня',
    imageUrl: delivery,
    alt: 'Відкрита коробка з пакетами кави',
    caption: 'фото поставки',
    tags: [],
    media: 'image',
  },
];

const extras: Record<string, Partial<StoreProfileExtra>> = {
  'cool-coffee': {
    bio: 'Свіжа обжарка малими партіями і посуд для дому.',
    storefrontUrl: 'https://cool-coffee.example',
    posts: coolCoffeePosts,
  },
};

const wait = (ms: number, signal?: GenericAbortSignal) =>
  new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('The operation was aborted.', 'AbortError'));
      return;
    }

    const onAbort = () => {
      clearTimeout(timer);
      reject(new DOMException('The operation was aborted.', 'AbortError'));
    };
    const timer = setTimeout(() => {
      signal?.removeEventListener?.('abort', onAbort);
      resolve();
    }, ms);

    signal?.addEventListener?.('abort', onAbort, { once: true });
  });

const profileFor = (id: string): StoreProfile | null => {
  const store = readStoreDto(id);
  if (!store) return null;

  const extra = extras[id];
  return {
    ...store,
    bio: extra?.bio ?? store.description,
    avatarTone: extra?.avatarTone ?? tones[id] ?? 'navy',
    storefrontUrl: extra?.storefrontUrl ?? null,
    conversationId: conversations[id] ?? null,
    posts: extra?.posts ?? [],
  };
};

export const resolveStoreMock = async (
  method: string,
  path: string,
  signal?: GenericAbortSignal
): Promise<StoreMockResult | null> => {
  const normalized = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
  const match = normalized.match(/^\/stores\/([^/]+)$/);
  if (method !== 'get' || !match) return null;

  const id = decodeURIComponent(match[1]);
  const profile = profileFor(id);
  if (!profile) return { status: 404, data: { message: 'Store not found' } };

  await wait(180, signal);
  const current = profileFor(id);
  if (!current) return { status: 404, data: { message: 'Store not found' } };
  return { status: 200, data: current };
};
