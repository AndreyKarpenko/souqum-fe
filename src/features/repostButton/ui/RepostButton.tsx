import { type FC } from 'react';
import { useSelector } from 'react-redux';
import { userInfoSelector } from '@/entities/user';

export const RepostButton: FC<{ post: any; onRepost: () => void }> = ({ post, onRepost }) => {
  const user = useSelector(userInfoSelector);

  return (
    <div>
      {user?.accountId !== post.author.accountId && (
        <div
          className={`${post.isReposted ? 'text-blue-400' : 'cursor-pointer text-black'}`}
          onClick={() => {
            if (!post.isReposted) {
              onRepost();
            }
          }}
        >
          Repost {!!post._count.reposts && post._count.reposts}
        </div>
      )}
    </div>
  );
};
