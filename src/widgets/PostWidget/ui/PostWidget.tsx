import { type FC } from 'react';

import { PostContent } from '@/widgets/PostContent/ui/PostContent.tsx';
import { LikeButton } from '@/features/likeButton/ui/LikeButton.tsx';
import { RepostButton } from '@/features/repostButton/ui/RepostButton.tsx';
import { CommentCounter } from '@/features/commentCounter/ui/CommentCounter.tsx';
import { CommentWidget } from '@/widgets/CommentWidget/ui/CommentWidget.tsx';
import { DeletePostButton } from '@/features/deletePostButton/ui/DeletePostButton.tsx';

export const PostWidget: FC<{ post: any }> = ({ post }) => {
  return (
    <div className={'flex gap-5 flex-col border shadow-xl rounded-2xl p-5'}>
      <div className={'shadow-2xl p-5 rounded-2xl flex flex-col gap-5'}>
        <div className={'flex flex-1'}>
          <PostContent post={post} />
          <DeletePostButton post={post} />
        </div>
        <div className={'flex gap-2 items-center'}>
          <CommentCounter post={post} />
          <RepostButton post={post} />
          <LikeButton post={post} />
        </div>
      </div>
      <CommentWidget post={post} />
    </div>
  );
};
