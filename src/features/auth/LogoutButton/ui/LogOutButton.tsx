import { useAppDispatch } from '@/app/store/useAppDispatch.ts';
import { removeUser } from '@/entities/user/redux';
import { logout } from '@/features/auth/LogoutButton/api/logoutService.tsx';
import { useNavigate } from 'react-router';

export const LogOutButton = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    await logout();
    dispatch(removeUser());
    navigate('/');
  };

  return <div onClick={logoutHandler}>logout</div>;
};
