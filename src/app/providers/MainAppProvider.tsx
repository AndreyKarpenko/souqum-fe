import React, { type FC, useEffect } from 'react';
import { useAppDispatch } from '@/app/store/useAppDispatch.ts';
import { checkSessionThunk } from '@/entities/auth/redux';

let sessionCheckStarted = false;

export const MainAppProvider: FC<React.PropsWithChildren> = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (sessionCheckStarted) return;

    sessionCheckStarted = true;
    dispatch(checkSessionThunk());
  }, [dispatch]);

  return <div>{children}</div>;
};
