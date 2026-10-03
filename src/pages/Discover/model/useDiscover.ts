import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import {
  favoriteStoreApi,
  getDiscoverApi,
  getStoresApi,
  likeStoreApi,
  subscribeStoreApi,
  unfavoriteStoreApi,
  unlikeStoreApi,
  unsubscribeStoreApi,
  type DiscoverCategory,
  type Store,
  type StoreCategoryFilter,
} from '@/entities/store';
import type { StoreAction } from '@/pages/Discover/model/types.ts';

const replaceStore = (stores: Store[], next: Store) =>
  stores.map((store) => (store.id === next.id ? next : store));

const isAbort = (error: unknown) => axios.isCancel(error) || (error instanceof DOMException && error.name === 'AbortError');

export const useDiscover = () => {
  const [popular, setPopular] = useState<Store[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [categories, setCategories] = useState<DiscoverCategory[]>([]);
  const [category, setCategory] = useState<StoreCategoryFilter>('all');
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [listStatus, setListStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [actionError, setActionError] = useState<string | null>(null);
  const [pending, setPending] = useState<Record<string, true>>({});
  const [loadId, setLoadId] = useState(0);
  const skipCategoryFetch = useRef(true);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setStatus('loading');
    setActionError(null);

    getDiscoverApi(controller.signal)
      .then((feed) => {
        if (controller.signal.aborted) return;
        setPopular(feed.popular);
        setStores(feed.stores);
        setCategories(feed.categories);
        setListStatus('idle');
        setStatus('ready');
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted || isAbort(error)) return;
        setStatus('error');
      });

    return () => controller.abort();
  }, [loadId]);

  useEffect(() => {
    if (skipCategoryFetch.current) {
      skipCategoryFetch.current = false;
      return;
    }

    const controller = new AbortController();
    setListStatus('loading');

    getStoresApi(category, controller.signal)
      .then((next) => {
        if (controller.signal.aborted) return;
        setStores(next);
        setListStatus('idle');
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted || isAbort(error)) return;
        setListStatus('error');
      });

    return () => controller.abort();
  }, [category]);

  const reload = useCallback(() => {
    setLoadId((value) => value + 1);
  }, []);

  const toggle = useCallback(async (store: Store, action: StoreAction) => {
    const key = `${store.id}:${action}`;
    setPending((current) => ({ ...current, [key]: true }));
    setActionError(null);

    try {
      const next = await runStoreAction(store, action);
      if (!mounted.current) return;
      setPopular((items) => replaceStore(items, next));
      setStores((items) => replaceStore(items, next));
    } catch (error: unknown) {
      if (!mounted.current || isAbort(error)) return;
      setActionError('Не вдалося оновити магазин');
    } finally {
      if (mounted.current) {
        setPending((current) => {
          const next = { ...current };
          delete next[key];
          return next;
        });
      }
    }
  }, []);

  const isPending = useCallback(
    (storeId: string, action: StoreAction) => Boolean(pending[`${storeId}:${action}`]),
    [pending]
  );

  return {
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
  };
};

const runStoreAction = (store: Store, action: StoreAction) => {
  if (action === 'like') {
    return store.isLiked ? unlikeStoreApi(store.id) : likeStoreApi(store.id);
  }
  if (action === 'favorite') {
    return store.isFavorite ? unfavoriteStoreApi(store.id) : favoriteStoreApi(store.id);
  }
  return store.isSubscribed ? unsubscribeStoreApi(store.id) : subscribeStoreApi(store.id);
};
