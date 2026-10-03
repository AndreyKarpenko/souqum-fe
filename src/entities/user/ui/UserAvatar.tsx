import type { FC } from 'react';

const sizeClass = {
  sm: 'h-10 w-10',
  md: 'h-15 w-15',
} as const;

type UserAvatarProps = {
  user: {
    avatar: string | null;
  };
  size?: keyof typeof sizeClass;
};

export const UserAvatar: FC<UserAvatarProps> = ({ user, size = 'sm' }) => {
  return (
    <div className="overflow-hidden h-fit w-fit rounded-full bg-white border-2 border-black">
      <img src={user.avatar ?? undefined} alt="" className={sizeClass[size]} />
    </div>
  );
};
