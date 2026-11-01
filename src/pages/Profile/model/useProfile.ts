import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import {
  followProfileApi,
  getMySocialProfileApi,
  getSocialProfileApi,
  publishProfilePostApi,
  setShelfVisibilityApi,
  unfollowProfileApi,
  updateProfileAvatarApi,
  type SocialProfile,
} from '@/entities/profile';
import { getMyProfileApi, getUserProfileApi } from '@/entities/user';
import { mergeOwnProfile, socialProfileFromUser } from '@/pages/Profile/model/socialProfileFromUser.ts';

const isAbort = (error: unknown) =>
  axios.isCancel(error) || (error instanceof DOMException && error.name === 'AbortError');

const isNotFound = (error: unknown) => axios.isAxiosError(error) && error.response?.status === 404;

export const readImageFile = (file: File) =>
  new Promise<string>((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('type'));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      reject(new Error('size'));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result);
      else reject(new Error('read'));
    };
    reader.onerror = () => reject(new Error('read'));
    reader.readAsDataURL(file);
  });

export const useProfile = (profileId: string | undefined) => {
  const [profile, setProfile] = useState<SocialProfile | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error' | 'missing'>('loading');
  const [actionError, setActionError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [loadId, setLoadId] = useState(0);
  const mounted = useRef(true);
  const serverUser = useRef<unknown>(null);

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

    const request = (async () => {
      let me: unknown = null;
      try {
        me = await getMyProfileApi(controller.signal);
      } catch (error: unknown) {
        if (isAbort(error)) throw error;
      }

      const myId =
        me && typeof me === 'object' && 'accountId' in me && typeof me.accountId === 'string'
          ? me.accountId
          : '';
      if (!profileId || profileId === 'me' || (myId !== '' && profileId === myId)) {
        serverUser.current = me;
        const shell = await getMySocialProfileApi(controller.signal);
        return me ? mergeOwnProfile(shell, me) : shell;
      }

      serverUser.current = null;
      return getSocialProfileApi(profileId, controller.signal).catch(async (error: unknown) => {
        if (!isNotFound(error)) throw error;
        const user = await getUserProfileApi(profileId, controller.signal);
        const mapped = socialProfileFromUser(user);
        if (!mapped) throw error;
        return mapped;
      });
    })();

    request
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
  }, [profileId, loadId]);

  const reload = useCallback(() => {
    setLoadId((value) => value + 1);
  }, []);

  const run = useCallback(async (action: () => Promise<SocialProfile>, failure: string) => {
    setPending(true);
    setActionError(null);
    try {
      const next = await action();
      if (!mounted.current) return false;
      setProfile(next.isMine && serverUser.current ? mergeOwnProfile(next, serverUser.current) : next);
      return true;
    } catch (error: unknown) {
      if (!mounted.current || isAbort(error)) return false;
      setActionError(failure);
      return false;
    } finally {
      if (mounted.current) setPending(false);
    }
  }, []);

  const publish = useCallback(
    (text: string, imageUrl: string) =>
      run(() => publishProfilePostApi({ text, imageUrl }), 'Не вдалося опублікувати пост'),
    [run]
  );

  const setShelfPublic = useCallback(
    (isPublic: boolean) =>
      run(() => setShelfVisibilityApi(isPublic), 'Не вдалося оновити полицю'),
    [run]
  );

  const toggleFollow = useCallback(() => {
    if (!profile || profile.isMine) return Promise.resolve(false);
    return run(
      () => (profile.isFollowing ? unfollowProfileApi(profile.id) : followProfileApi(profile.id)),
      'Не вдалося оновити підписку'
    );
  }, [profile, run]);

  const updateAvatar = useCallback(
    (imageUrl: string) => run(() => updateProfileAvatarApi(imageUrl), 'Не вдалося змінити аватар'),
    [run]
  );

  return {
    profile,
    status,
    actionError,
    pending,
    reload,
    publish,
    setShelfPublic,
    toggleFollow,
    updateAvatar,
  };
};
