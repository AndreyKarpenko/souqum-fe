import { type FC, useEffect, useState } from 'react';
import apiClient from '@/app/api/apiClient.tsx';
import { UserAvatar } from '@/features/userAvatar/ui/UserAvatar.tsx';
import { UserAvatarType } from '@/features/userAvatar/model/types.ts';

export const FollowingPage: FC = () => {
  const [users, setUser] = useState<any[]>([]);

  const getAllUsers = async () => {
    const { data } = await apiClient.get('/user/subscriptions');
    setUser(data);
  };

  useEffect(() => {
    void getAllUsers();
  }, []);

  return (
    <div className={'flex flex-1 flex-col gap-5'}>
      {users?.map((user) => (
        <>
          <div className={'p-5 gap-5 flex h-30 flex-row items-center bg-amber-400 '}>
            <UserAvatar profile={user} type={UserAvatarType.comment} />
            {user.displayName}
          </div>
        </>
      ))}
    </div>
  );
};
