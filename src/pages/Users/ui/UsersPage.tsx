import { type FC, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useSelector } from 'react-redux';
import { getAllUsersApi } from '@/entities/user';
import { UserAvatar } from '@/entities/user';
import { userInfoSelector } from '@/entities/user';
import { profilePath } from '@/shared/config/profilePath.ts';

export const UsersPage: FC = () => {
  const me = useSelector(userInfoSelector);
  const [users, setUser] = useState<any[]>([]);

  const getAllUsers = async () => {
    const data = await getAllUsersApi();
    setUser(data);
  };

  useEffect(() => {
    void getAllUsers();
  }, []);

  return (
    <div className={'flex flex-1 flex-col gap-5'}>
      {users.length &&
        users.map((user) => (
          <>
            <div className={'p-5 gap-5 flex h-30 flex-row items-center bg-amber-400 '}>
              {user.accountId && (
                <Link to={profilePath(user.accountId, me?.accountId)}>
                  <UserAvatar user={user} />
                </Link>
              )}
              {user.accountId}
              {user.firstName}
              {user.lastName}
            </div>
          </>
        ))}
    </div>
  );
};
