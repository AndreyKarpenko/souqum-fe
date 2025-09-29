import { useEffect, useState } from 'react';
import { SocketApi } from '@/app/configs/socket/socket.ts';
import { useSelector } from 'react-redux';
import { userTokenSelector } from '@/entities/auth/redux';
import type { Socket } from 'socket.io-client';

export const useSocketConnection = () => {
  const isAuth = useSelector(userTokenSelector);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (isAuth) {
      setSocket(SocketApi.createConnection());
    }
  }, [isAuth]);

  return { socket };
};
