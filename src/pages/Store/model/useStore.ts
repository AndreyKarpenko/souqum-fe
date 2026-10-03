import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import {
  getStoreApi,
  subscribeStoreApi,
  unsubscribeStoreApi,
  type StoreProfile,
} from '@/entities/store';

const isAbort = (error: unknown) =>
  axios.isCancel(error) || (error instanceof DOMException && error.name === 'AbortError');

const isNotFound = (error: unknown) => axios.isAxiosError(error) && error.response?.status === 404;

export const useStore = (storeId: string | undefined) => {
  const [profile, setProfile] = useState<StoreProfile | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error' | 'missing'>('loading');
  const [actionError, setActionError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [loadId, setLoadId] = useState(0);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!storeId) {
      setProfile(null);
      setStatus('missing');
      return;
    }

    const controller = new AbortController();
    setStatus('loading');
    setActionError(null);

    getStoreApi(storeId, controller.signal)
      .then((next) => {
        if (controller.signal.aborted) return;
        setProfile(next);
        setStatus('ready');
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted || isAbort(error)) return;
        setProfile(null);
        setStatus(isNotFound(error) ? 'missing' : 'error');
      });

    return () => controller.abort();
  }, [storeId, loadId]);

  const reload = useCallback(() => {
    setLoadId((value) => value + 1);
  }, []);

  const toggleSubscription = useCallback(async () => {
    if (!profile) return;
    setPending(true);
    setActionError(null);

    try {
      const next = profile.isSubscribed
        ? await unsubscribeStoreApi(profile.id)
        : await subscribeStoreApi(profile.id);
      if (!mounted.current) return;
      setProfile((current) =>
        current && current.id === next.id ? { ...current, ...next } : current
      );
    } catch (error: unknown) {
      if (!mounted.current || isAbort(error)) return;
      setActionError('Не вдалося оновити підписку');
    } finally {
      if (mounted.current) setPending(false);
    }
  }, [profile]);

  return { profile, status, actionError, pending, reload, toggleSubscription };
};
