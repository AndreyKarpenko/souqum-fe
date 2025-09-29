import { type FC } from 'react';
import { UserAvatar } from '@/features/userAvatar/ui/UserAvatar.tsx';
import { UserAvatarType } from '@/features/userAvatar/model/types.ts';

import { AttachmentWidget } from '@/widgets/AttachmentWidget/ui/AttachmentWidget.tsx';

export const PostContent: FC<{ post: any; isRepost?: boolean }> = ({ post, isRepost }) => {
  return (
    <div className={`flex flex-1 flex-col gap-5`}>
      <div className={'flex flex-1 gap-5 items-center'}>
        <UserAvatar
          profile={post.author}
          type={isRepost ? UserAvatarType.repost : UserAvatarType.post}
        />
        <div className={'flex flex-col'}>
          <div className={`${isRepost ? 'text-lg' : 'text-2xl'}`}>{post?.author?.username}</div>
          <div className={`${isRepost ? 'text-xs' : 'text-sm'} text-gray-400`}>
            {new Date(post.createdAt).toDateString()}
          </div>
        </div>
      </div>

      {post?.originalPost && (
        <div className={'flex flex-col ml-5 pl-5'}>
          <PostContent isRepost post={post.originalPost} />
        </div>
      )}

      <AttachmentWidget media={post?.media} />

      <div className={'flex flex-1 items-center'}>{post.content}</div>
    </div>
  );
};
