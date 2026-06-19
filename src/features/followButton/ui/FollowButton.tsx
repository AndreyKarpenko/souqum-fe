import { AppButton } from '@/shared/ui/AppButton/AppButton.tsx';
import apiClient from '@/app/api/apiClient.tsx';
import type { FC } from 'react';

export const FollowButton: FC<{ user: any }> = ({ user }) => {
  const follow = async () => {
    await apiClient.post(`user/subscribe/${user?.accountId}`);
  };

  const unfollow = async () => {
    await apiClient.delete(`user/unsubscribe/${user?.accountId}`);
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
