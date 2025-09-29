import { type FC, useEffect, useState } from 'react';
import apiClient from '@/app/api/apiClient.tsx';
import { useNavigate } from 'react-router';

export const FollowingPage: FC = () => {
  const [users, setUser] = useState<any[]>([]);
  const navigate = useNavigate();

  const getAllUsers = async () => {
    const { data } = await apiClient.get('/subscriptions/following');
    setUser(data);
  };

  useEffect(() => {
    void getAllUsers();
  }, []);

  return (
    <div className={'flex flex-1 flex-col gap-5'}>
      {users.map((user) => (
        <>
          <div
            onClick={() => navigate(`/profile/${user.id}`)}
            className={'p-5 gap-5 flex h-30 flex-row items-center bg-amber-400 '}
          >
            <img
              onClick={() => navigate(`/profile/${user.id}`)}
              src={user.avatar}
              alt="user_avatar"
              className={'h-10 w-10 rounded-full bg-blue-600'}
            />
            {user.displayName}
          </div>
        </>
      ))}
    </div>
  );
};
