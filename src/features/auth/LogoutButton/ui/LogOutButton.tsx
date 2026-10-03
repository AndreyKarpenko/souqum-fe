import { useThunkDispatch } from '@/shared/lib/useThunkDispatch.ts';
import { signOutThunk } from '@/features/auth/LogoutButton/model/signOutThunk.ts';

export const LogOutButton = () => {
  const dispatch = useThunkDispatch();

  const logoutHandler = async () => {
    dispatch(signOutThunk());
  };

  return <div onClick={logoutHandler}>logout</div>;
};
