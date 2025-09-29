import { useAppDispatch } from '@/app/store/useAppDispatch.ts';
import { signOutThunk } from '@/entities/auth/redux';

export const LogOutButton = () => {
  const dispatch = useAppDispatch();

  const logoutHandler = async () => {
    dispatch(signOutThunk());
  };

  return <div onClick={logoutHandler}>logout</div>;
};
