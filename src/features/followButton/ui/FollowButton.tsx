import { AppButton } from '@/shared/ui/AppButton/AppButton.tsx';
import type { FC } from 'react';
import { followUserApi, unfollowUserApi } from '@/features/followButton/api/followApi.ts';

export const FollowButton: FC<{ user: any }> = ({ user }) => {
  const follow = async () => {
    await followUserApi(user?.accountId);
  };

  const unfollow = async () => {
    await unfollowUserApi(user?.accountId);
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
