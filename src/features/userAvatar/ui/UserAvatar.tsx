import { type FC, useCallback, useMemo, type MouseEvent } from 'react';
import { useSelector } from 'react-redux';
import { userInfoSelector } from '@/entities/user/redux';
import { useNavigate } from 'react-router';
import { UserAvatarType } from '@/features/userAvatar/model/types.ts';

export const UserAvatar: FC<{ profile: any; type: UserAvatarType }> = ({ type, profile }) => {
  const user = useSelector(userInfoSelector);
  const navigate = useNavigate();

  const openProfileHandler = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      e.preventDefault();

      console.log(user, profile)
      if (user?.accountId === profile.accountId) {
        navigate(`/profile`);
      } else {
        navigate(`/profile/${profile.accountId}`);
      }
    },
    [navigate, profile?.accountId, user?.accountId]
  );

  const userAvatar = useMemo(() => {
    if (profile) {
      switch (type) {
        case UserAvatarType.main:
          return <img src={profile?.avatar} alt="user_avatar" className={'h-10 w-10'} />;
        case UserAvatarType.post:
          return <img src={profile?.avatar} alt="user_avatar" className={'h-15 w-15'} />;
        case UserAvatarType.repost:
          return <img src={profile?.avatar} alt="user_avatar" className={'h-10 w-10'} />;
        case UserAvatarType.comment:
          return <img src={profile?.avatar} alt="user_avatar" className={'h-10 w-10'} />;
        case UserAvatarType.dialogue:
          return <img src={profile?.avatar} alt="user_avatar" className={'h-10 w-10'} />;
        case UserAvatarType.header:
          return <img src={profile?.avatar} alt="user_avatar" className={'h-10 w-10'} />;

        default:
          return <img src={profile.avatar} alt="user_avatar" className={'h-10 w-10'} />;
      }
    }
  }, [profile, type]);

  return (
    <div
      onClick={openProfileHandler}
      className={
        'overflow-hidden cursor-pointer h-fit w-fit rounded-full bg-white border-2 border-black'
      }
    >
      {userAvatar}
    </div>
  );
};
