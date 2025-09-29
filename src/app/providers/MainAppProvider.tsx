import React, { type FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { refreshTokenThunk, userIsLoggedInSelector } from '@/entities/auth/redux';
import { useAppDispatch } from '@/app/store/useAppDispatch.ts';
import { userInfoSelector } from '@/entities/user/redux';
import { useSocketConnection } from '@/app/hooks/useSocketConnection.ts';

export const MainAppProvider: FC<React.PropsWithChildren> = ({ children }) => {
  const isLoggedIn = useSelector(userIsLoggedInSelector);
  const dispatch = useAppDispatch();
  const user = useSelector(userInfoSelector);

  const { socket } = useSocketConnection();

  useEffect(() => {
    socket?.emit('subscribeAll', { userId: user?.id });
    return () => {
      socket?.emit('unsubscribeAll', { userId: user?.id });
    };
  }, [socket, user, user?.id]);

  useEffect(() => {
    if (isLoggedIn) dispatch(refreshTokenThunk());
  }, [dispatch, isLoggedIn]);

  return <div>{children}</div>;
};
