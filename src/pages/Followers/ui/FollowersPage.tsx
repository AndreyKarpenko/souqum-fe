import { type FC, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useSelector } from 'react-redux';
import { getSubscribersApi } from '@/entities/user';
import { UserAvatar } from '@/entities/user';
import { userInfoSelector } from '@/entities/user';
import { profilePath } from '@/shared/config/profilePath.ts';

export const FollowersPage: FC = () => {
  const me = useSelector(userInfoSelector);
  const [users, setUser] = useState<any[]>([]);

  const getAllUsers = async () => {
    const data = await getSubscribersApi();
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
            {user.accountId && (
              <Link to={profilePath(user.accountId, me?.accountId)}>
                <UserAvatar user={user} />
              </Link>
            )}
            {user.displayName}
          </div>
        </>
      ))}
    </div>
  );
};
