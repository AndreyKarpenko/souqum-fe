import React, { type FC, useEffect } from 'react';
import { useAppDispatch } from '@/app/store/useAppDispatch.ts';
import { store } from '@/app/store';
import { checkSessionThunk } from '@/features/checkSession/model/checkSessionThunk.ts';
import { signOutThunk } from '@/features/auth/LogoutButton/model/signOutThunk.ts';
import { setSessionExpiredHandler } from '@/shared/api/apiClient';

let sessionCheckStarted = false;

export const MainAppProvider: FC<React.PropsWithChildren> = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    setSessionExpiredHandler(() => {
      if (!store.getState().auth.isAuthenticated) return;
      return dispatch(signOutThunk()).then(() => undefined);
    });

    if (!sessionCheckStarted) {
      sessionCheckStarted = true;
      dispatch(checkSessionThunk());
    }

    return () => setSessionExpiredHandler(null);
  }, [dispatch]);

  return <div>{children}</div>;
};
