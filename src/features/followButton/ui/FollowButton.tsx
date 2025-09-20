import { AppButton } from '@/shared/ui/AppButton/AppButton.tsx';
import instance from '@/app/api/apiClient.tsx';
import type { FC } from 'react';

export const FollowButton: FC<{ user: any }> = ({ user }) => {
  const follow = async () => {
    await instance.post('subscriptions/follow', {
      followingId: user?.id,
    });
  };

  const unfollow = async () => {
    await instance.post('subscriptions/unfollow', {
      followingId: user?.id,
    });
  };

  return (
    <>
      {user?.isFollowed ? (
        <AppButton onClick={unfollow} title={'UnFollow'} />
      ) : (
        <AppButton onClick={follow} title={'Follow'} />
      )}
    </>
  );
};
