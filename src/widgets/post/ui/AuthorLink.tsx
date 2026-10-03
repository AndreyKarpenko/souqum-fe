import { type FC } from 'react';
import { Link } from 'react-router';
import { useSelector } from 'react-redux';
import { UserAvatar } from '@/entities/user';
import { userInfoSelector } from '@/entities/user';
import { profilePath } from '@/shared/config/profilePath.ts';

export const AuthorLink: FC<{
  author?: { accountId?: string; avatar?: string | null };
  size?: 'sm' | 'md';
}> = ({ author, size = 'sm' }) => {
  const me = useSelector(userInfoSelector);

  if (!author?.accountId) return null;

  return (
    <Link to={profilePath(author.accountId, me?.accountId)}>
      <UserAvatar user={{ avatar: author.avatar ?? null }} size={size} />
    </Link>
  );
};
