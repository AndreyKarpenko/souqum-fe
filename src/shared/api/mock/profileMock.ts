import type { GenericAbortSignal } from 'axios';
import type { SocialProfile } from '@/entities/profile/model/types.ts';
import roast from '@/pages/Landing/assets/content-roast.png';
import cup from '@/pages/Landing/assets/content-cup.png';
import delivery from '@/pages/Landing/assets/content-delivery.png';
import shirt from '@/pages/Landing/assets/item-shirt.png';
import bowl from '@/pages/Landing/assets/item-bowl.png';
import chemex from '@/pages/Landing/assets/item-chemex.png';
import monstera from '@/pages/Landing/assets/item-monstera.png';
import kenya from '@/pages/Landing/assets/item-kenya.png';
import coffee from '@/pages/Landing/assets/store-coffee.png';
import green from '@/pages/Landing/assets/store-green.png';
import honey from '@/pages/Landing/assets/store-honey.png';
import keramos from '@/pages/Landing/assets/store-keramos.png';
import linen from '@/pages/Landing/assets/store-linen.png';
import loom from '@/pages/Landing/assets/store-loom.png';
import oak from '@/pages/Landing/assets/store-oak.png';
import paper from '@/pages/Landing/assets/store-paper.png';
import itemCup from '@/pages/Landing/assets/item-cup.png';

type ProfileMockResult = {
  status: number;
  data: unknown;
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

const readBody = (body: unknown): Record<string, unknown> | null => {
  const asRecord = (value: unknown) =>
    value && typeof value === 'object' && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : null;

  if (typeof body === 'string') {
    try {
      return asRecord(JSON.parse(body));
    } catch {
      return null;
    }
  }

  return asRecord(body);
};

let olenaAvatarUrl: string | null = null;
let postSeq = 0;

const records: Record<'olena' | 'marko', SocialProfile> = {
  olena: {
    id: 'olena',
    firstName: 'Олена',
    lastName: 'Коваль',
    handle: 'olena',
    city: 'Київ',
    bio: 'Ділюся речами, які беру додому. Пост підписує людина, не магазин.',
    bioShort: 'Пост підписує людина, не магазин.',
    initial: 'О',
    avatarUrl: null,
    coverUrl: roast,
    coverAlt: 'Обжарка кави вдома',
    postsCount: 12,
    followersCount: 86,
    isMine: true,
    isFollowing: false,
    shelfPublic: true,
    posts: [
      {
        id: 'chemex-morning',
        title: 'Ранок з кемексом',
        imageUrl: cup,
        alt: 'Чашка кави',
        attribution: 'від себе',
      },
      {
        id: 'home-roast',
        title: 'Обжарка вдома',
        imageUrl: roast,
        alt: 'Пакети кави та зерна',
        attribution: 'від себе',
      },
      {
        id: 'linen-table',
        title: 'Льон на столі',
        imageUrl: shirt,
        alt: 'Лляна сорочка',
        attribution: 'від себе',
      },
      {
        id: 'new-bowl',
        title: 'Нова миска',
        imageUrl: bowl,
        alt: 'Керамічна миска',
        attribution: 'від себе',
      },
      {
        id: 'parcel',
        title: 'Прийшла посилка',
        imageUrl: delivery,
        alt: 'Відкрита коробка з пакетами',
        attribution: 'від себе',
      },
      {
        id: 'chemex',
        title: 'Кемекс',
        imageUrl: chemex,
        alt: 'Кемекс',
        attribution: 'від себе',
      },
    ],
    shelf: [
      {
        id: 'linen-atelier',
        title: 'Linen Atelier',
        imageUrl: linen,
        alt: 'Linen Atelier',
        href: '/s/linen-atelier',
      },
      {
        id: 'linen-shirt',
        title: 'Льняна сорочка',
        imageUrl: shirt,
        alt: 'Льняна сорочка',
        href: '/s/linen-atelier',
      },
      {
        id: 'bowl',
        title: 'Піала',
        imageUrl: bowl,
        alt: 'Піала',
        href: '/s/keramos',
      },
      {
        id: 'honey-field',
        title: 'Honey Field',
        imageUrl: honey,
        alt: 'Honey Field',
        href: '/s/honey-field',
      },
      {
        id: 'north-loom',
        title: 'North Loom',
        imageUrl: loom,
        alt: 'North Loom',
        href: '/s/north-loom',
      },
      {
        id: 'paper-boat',
        title: 'Paper Boat',
        imageUrl: paper,
        alt: 'Paper Boat',
        href: '/s/paper-boat',
      },
    ],
    stores: [
      {
        id: 'cool-coffee',
        name: 'Cool Coffee',
        summary: 'Обжарка і посуд · у мережі',
        imageUrl: coffee,
        alt: 'Cool Coffee',
      },
      {
        id: 'keramos',
        name: 'Keramos',
        summary: 'Посуд з глини · у мережі',
        imageUrl: keramos,
        alt: 'Keramos',
      },
    ],
    draft: {
      imageUrl: cup,
      imageAlt: 'Чашка кави',
      text: 'Ранок з кемексом.',
    },
    postsAside: {
      title: 'Пост від себе',
      text: 'Фото або відео публікує Олена. Магазин можна позначити, можна ні.',
    },
    shelfAside: {
      title: 'Полиця',
      text: 'Обране: магазини і товари. Чеки сюди не потрапляють.',
    },
  },
  marko: {
    id: 'marko',
    firstName: 'Марко',
    lastName: 'Лис',
    handle: 'marko',
    city: 'Львів',
    bio: 'Збирає глину, каву і рослини. Пости публікує від себе.',
    bioShort: 'Пости від себе. Підписка — на людину.',
    initial: 'М',
    avatarUrl: null,
    coverUrl: green,
    coverAlt: 'Рослини Green Room',
    postsCount: 8,
    followersCount: 312,
    isMine: false,
    isFollowing: false,
    shelfPublic: true,
    posts: [
      {
        id: 'monstera',
        title: 'Монстера на вікні',
        imageUrl: monstera,
        alt: 'Монстера',
        attribution: 'від Марка',
      },
      {
        id: 'planter',
        title: 'Нове кашпо',
        imageUrl: green,
        alt: 'Кашпо',
        attribution: 'від Марка',
      },
      {
        id: 'bowl',
        title: 'Піала',
        imageUrl: bowl,
        alt: 'Піала',
        attribution: 'від Марка',
      },
      {
        id: 'parcel',
        title: 'Посилка',
        imageUrl: delivery,
        alt: 'Посилка',
        attribution: 'від Марка',
      },
      {
        id: 'kenya',
        title: 'Кенія',
        imageUrl: kenya,
        alt: 'Кава Кенія',
        attribution: 'від Марка',
      },
      {
        id: 'candle',
        title: 'Свічка',
        imageUrl: honey,
        alt: 'Свічка',
        attribution: 'від Марка',
      },
    ],
    shelf: [
      {
        id: 'cool-coffee',
        title: 'Cool Coffee',
        imageUrl: coffee,
        alt: 'Cool Coffee',
        href: '/s/cool-coffee',
      },
      {
        id: 'keramos',
        title: 'Keramos',
        imageUrl: keramos,
        alt: 'Keramos',
        href: '/s/keramos',
      },
      {
        id: 'chemex',
        title: 'Кемекс',
        imageUrl: chemex,
        alt: 'Кемекс',
        href: '/s/cool-coffee',
      },
      {
        id: 'salt-oak',
        title: 'Salt & Oak',
        imageUrl: oak,
        alt: 'Salt & Oak',
        href: '/s/salt-oak',
      },
      {
        id: 'cup',
        title: 'Чашка',
        imageUrl: itemCup,
        alt: 'Чашка',
        href: '/s/cool-coffee',
      },
      {
        id: 'linen-atelier',
        title: 'Linen Atelier',
        imageUrl: linen,
        alt: 'Linen Atelier',
        href: '/s/linen-atelier',
      },
    ],
    stores: [
      {
        id: 'green-room',
        name: 'Green Room',
        summary: 'Рослини і кашпо · у мережі',
        imageUrl: green,
        alt: 'Green Room',
      },
    ],
    draft: null,
    postsAside: {
      title: 'Пости Марка',
      text: 'Публікує від себе. Підписатися і написати — тут. Свій профіль лишається пунктом сайдбара.',
    },
    shelfAside: {
      title: 'Полиця Марка',
      text: 'Магазини і товари, які він зберіг. Чеків тут немає.',
    },
  },
};

const cloneProfile = (profile: SocialProfile, isMine: boolean): SocialProfile => ({
  ...profile,
  isMine,
  avatarUrl: profile.id === 'olena' ? olenaAvatarUrl : profile.avatarUrl,
  posts: profile.posts.map((post) => ({ ...post })),
  shelf: !isMine && !profile.shelfPublic ? [] : profile.shelf.map((item) => ({ ...item })),
  stores: profile.stores.map((store) => ({ ...store })),
  draft: isMine && profile.draft ? { ...profile.draft } : null,
  postsAside: { ...profile.postsAside },
  shelfAside: { ...profile.shelfAside },
});

const findRecord = (id: string) => {
  if (id === 'me' || id === 'olena') return records.olena;
  if (id === 'marko') return records.marko;
  return null;
};

const present = (id: string) => {
  const record = findRecord(id);
  if (!record) return null;
  return cloneProfile(record, record.id === 'olena');
};

export const readSessionUser = () => ({
  accountId: 'olena',
  email: 'olena@example.com',
  firstName: 'Олена',
  lastName: 'Коваль',
  bio: records.olena.bio,
  avatar: olenaAvatarUrl,
});

const publishPost = async (body: unknown, signal?: GenericAbortSignal) => {
  const payload = readBody(body);
  const text = typeof payload?.text === 'string' ? payload.text.trim() : '';
  if (!text) return { status: 400, data: { message: 'Post text is required' } };
  if (text.length > 240) return { status: 400, data: { message: 'Post text is too long' } };

  const imageUrl =
    typeof payload?.imageUrl === 'string' && payload.imageUrl.trim()
      ? payload.imageUrl
      : records.olena.draft?.imageUrl;
  if (!imageUrl) return { status: 400, data: { message: 'Post image is required' } };

  await wait(160, signal);
  postSeq += 1;
  records.olena.posts.unshift({
    id: `post-${postSeq}`,
    title: text.replace(/\.$/, ''),
    imageUrl,
    alt: text,
    attribution: 'від себе',
  });
  records.olena.postsCount += 1;
  return { status: 200, data: present('olena') };
};

const setShelfVisibility = async (body: unknown, signal?: GenericAbortSignal) => {
  const payload = readBody(body);
  if (typeof payload?.public !== 'boolean') {
    return { status: 400, data: { message: 'Shelf visibility is required' } };
  }

  await wait(120, signal);
  records.olena.shelfPublic = payload.public;
  return { status: 200, data: present('olena') };
};

const setAvatar = async (body: unknown, signal?: GenericAbortSignal) => {
  const payload = readBody(body);
  const imageUrl = typeof payload?.imageUrl === 'string' ? payload.imageUrl.trim() : '';
  if (!imageUrl.startsWith('data:image/')) {
    return { status: 400, data: { message: 'Avatar image is required' } };
  }

  await wait(160, signal);
  olenaAvatarUrl = imageUrl;
  return { status: 200, data: present('olena') };
};

const setFollowing = async (profileId: string, following: boolean, signal?: GenericAbortSignal) => {
  const record = findRecord(profileId);
  if (!record || record.id === 'olena') {
    return { status: record ? 400 : 404, data: { message: record ? 'Cannot follow yourself' : 'Profile not found' } };
  }

  await wait(140, signal);
  if (record.isFollowing !== following) {
    record.followersCount += following ? 1 : -1;
    record.isFollowing = following;
  }
  return { status: 200, data: present(record.id) };
};

export const resolveProfileMock = async (
  method: string,
  path: string,
  signal?: GenericAbortSignal,
  body?: unknown
): Promise<ProfileMockResult | null> => {
  const normalized = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;

  if (method === 'get' && normalized === '/profiles/me') {
    await wait(180, signal);
    return { status: 200, data: present('olena') };
  }

  if (method === 'post' && normalized === '/profiles/me/posts') return publishPost(body, signal);
  if (method === 'patch' && normalized === '/profiles/me/shelf') return setShelfVisibility(body, signal);
  if (method === 'patch' && normalized === '/profiles/me/avatar') return setAvatar(body, signal);

  const followMatch = normalized.match(/^\/profiles\/([^/]+)\/follow$/);
  if (followMatch && (method === 'post' || method === 'delete')) {
    return setFollowing(decodeURIComponent(followMatch[1]), method === 'post', signal);
  }

  const profileMatch = normalized.match(/^\/profiles\/([^/]+)$/);
  if (method === 'get' && profileMatch) {
    const profile = present(decodeURIComponent(profileMatch[1]));
    if (!profile) return { status: 404, data: { message: 'Profile not found' } };
    await wait(180, signal);
    return { status: 200, data: present(decodeURIComponent(profileMatch[1])) };
  }

  return null;
};
