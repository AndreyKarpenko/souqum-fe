import { useThunkDispatch } from '@/shared/lib/useThunkDispatch.ts';
import { signOutThunk } from '@/features/auth/LogoutButton/model/signOutThunk.ts';

export const LogOutButton = () => {
  const dispatch = useThunkDispatch();

  const logoutHandler = () => {
    void dispatch(signOutThunk());
  };

  return (
    <button
      type="button"
      onClick={logoutHandler}
      className="w-fit text-left text-xs font-medium text-[#032048]/55"
    >
      Вийти
    </button>
  );
};
