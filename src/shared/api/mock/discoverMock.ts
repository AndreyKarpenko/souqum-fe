import type { GenericAbortSignal } from 'axios';
import coffee from '@/pages/Landing/assets/store-coffee.png';
import green from '@/pages/Landing/assets/store-green.png';
import honey from '@/pages/Landing/assets/store-honey.png';
import keramos from '@/pages/Landing/assets/store-keramos.png';
import linen from '@/pages/Landing/assets/store-linen.png';
import loom from '@/pages/Landing/assets/store-loom.png';
import oak from '@/pages/Landing/assets/store-oak.png';
import paper from '@/pages/Landing/assets/store-paper.png';

type StoreCategory = 'food' | 'home' | 'clothing';

type StoreRecord = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: StoreCategory;
  likesCount: number;
  isLiked: boolean;
  isFavorite: boolean;
  isSubscribed: boolean;
  popular: boolean;
};

export type DiscoverMockResult = {
  status: number;
  data: unknown;
};

const categories = [
  { id: 'all', label: 'Усі' },
  { id: 'food', label: 'Їжа' },
  { id: 'home', label: 'Дім' },
  { id: 'clothing', label: 'Одяг' },
];

const stores: StoreRecord[] = [
  {
    id: 'cool-coffee',
    name: 'Cool Coffee',
    description: 'Обжарка і посуд',
    imageUrl: coffee,
    category: 'food',
    likesCount: 128,
    isLiked: true,
    isFavorite: false,
    isSubscribed: true,
    popular: true,
  },
  {
    id: 'keramos',
    name: 'Keramos',
    description: 'Посуд з глини',
    imageUrl: keramos,
    category: 'home',
    likesCount: 24,
    isLiked: true,
    isFavorite: true,
    isSubscribed: true,
    popular: true,
  },
  {
    id: 'green-room',
    name: 'Green Room',
    description: 'Рослини і кашпо',
    imageUrl: green,
    category: 'home',
    likesCount: 0,
    isLiked: false,
    isFavorite: false,
    isSubscribed: false,
    popular: true,
  },
  {
    id: 'linen-atelier',
    name: 'Linen Atelier',
    description: 'Льон і домашній край',
    imageUrl: linen,
    category: 'clothing',
    likesCount: 0,
    isLiked: false,
    isFavorite: false,
    isSubscribed: false,
    popular: false,
  },
  {
    id: 'north-loom',
    name: 'North Loom',
    description: 'Вовна і пледи',
    imageUrl: loom,
    category: 'home',
    likesCount: 0,
    isLiked: false,
    isFavorite: false,
    isSubscribed: false,
    popular: false,
  },
  {
    id: 'salt-oak',
    name: 'Salt & Oak',
    description: 'Дошки і спеції',
    imageUrl: oak,
    category: 'food',
    likesCount: 0,
    isLiked: false,
    isFavorite: false,
    isSubscribed: false,
    popular: false,
  },
  {
    id: 'paper-boat',
    name: 'Paper Boat',
    description: 'Зошити і друк',
    imageUrl: paper,
    category: 'home',
    likesCount: 0,
    isLiked: false,
    isFavorite: false,
    isSubscribed: false,
    popular: false,
  },
  {
    id: 'honey-field',
    name: 'Honey Field',
    description: 'Мед і свічки',
    imageUrl: honey,
    category: 'food',
    likesCount: 0,
    isLiked: false,
    isFavorite: false,
    isSubscribed: false,
    popular: false,
  },
];

const toDto = (store: StoreRecord) => ({
  id: store.id,
  name: store.name,
  description: store.description,
  imageUrl: store.imageUrl,
  category: store.category,
  likesCount: store.likesCount,
  isLiked: store.isLiked,
  isFavorite: store.isFavorite,
  isSubscribed: store.isSubscribed,
});

const isCategory = (value: string): value is StoreCategory | 'all' =>
  value === 'all' || value === 'food' || value === 'home' || value === 'clothing';

const readCategory = (params: unknown) => {
  if (!params || typeof params !== 'object' || !('category' in params)) return 'all';
  const value = (params as { category?: unknown }).category;
  return typeof value === 'string' ? value : 'all';
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

const catalog = (category: string) =>
  stores
    .filter((store) => !store.popular)
    .filter((store) => category === 'all' || store.category === category)
    .map(toDto);

const findStore = (id: string) => stores.find((store) => store.id === id);

export const readStoreDto = (id: string) => {
  const store = findStore(id);
  return store ? toDto(store) : null;
};

const notFound = { status: 404, data: { message: 'Store not found' } };

const toggleLike = (store: StoreRecord) => {
  store.isLiked = !store.isLiked;
  store.likesCount = Math.max(0, store.likesCount + (store.isLiked ? 1 : -1));
};

const applyAction = async (
  id: string,
  method: string,
  signal: GenericAbortSignal | undefined,
  on: (store: StoreRecord) => void,
  off: (store: StoreRecord) => void
) => {
  const store = findStore(id);
  if (!store) return notFound;
  if (method === 'post') on(store);
  else if (method === 'delete') off(store);
  else return { status: 405, data: { message: 'Method not allowed' } };

  await wait(160, signal);
  const current = findStore(id);
  if (!current) return notFound;
  return { status: 200, data: toDto(current) };
};

export const resolveDiscoverMock = async (
  method: string,
  path: string,
  params: unknown,
  signal?: GenericAbortSignal
): Promise<DiscoverMockResult | null> => {
  const normalized = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
  if (!normalized.startsWith('/discover')) return null;

  if (method === 'get' && normalized === '/discover') {
    await wait(220, signal);
    return {
      status: 200,
      data: {
        popular: stores.filter((store) => store.popular).map(toDto),
        stores: catalog('all'),
        categories,
      },
    };
  }

  if (method === 'get' && normalized === '/discover/stores') {
    const category = readCategory(params);
    if (!isCategory(category)) return { status: 400, data: { message: 'Unknown category' } };
    await wait(180, signal);
    return { status: 200, data: catalog(category) };
  }

  const actionMatch = normalized.match(
    /^\/discover\/stores\/([^/]+)\/(likes|favorite|subscription)$/
  );
  if (!actionMatch) return { status: 404, data: { message: 'Not found' } };

  const id = decodeURIComponent(actionMatch[1]);
  const action = actionMatch[2];

  if (action === 'likes') {
    return applyAction(
      id,
      method,
      signal,
      (store) => {
        if (!store.isLiked) toggleLike(store);
      },
      (store) => {
        if (store.isLiked) toggleLike(store);
      }
    );
  }

  if (action === 'favorite') {
    return applyAction(
      id,
      method,
      signal,
      (store) => {
        store.isFavorite = true;
      },
      (store) => {
        store.isFavorite = false;
      }
    );
  }

  return applyAction(
    id,
    method,
    signal,
    (store) => {
      store.isSubscribed = true;
    },
    (store) => {
      store.isSubscribed = false;
    }
  );
};
