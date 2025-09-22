import { type FC } from 'react';
import { UserAvatar } from '@/features/userAvatar/ui/UserAvatar.tsx';
import { UserAvatarType } from '@/features/userAvatar/model/types.ts';
import { LikeButton } from '@/features/likeButton/ui/LikeButton.tsx';
import { LikeButtonType } from '@/features/likeButton/model/types.ts';
import { DeleteButton } from '@/features/deletePostButton/ui/DeleteButton.tsx';
import { DeleteButtonType } from '@/features/deletePostButton/model/types.ts';
import { AttachmentWidget } from '@/widgets/AttachmentWidget/ui/AttachmentWidget.tsx';

export const CommentContent: FC<{ comment: any }> = ({ comment }) => {
  return (
    <div className={'flex flex-col gap-2 mx-5 px-5 py-2 shadow-lg rounded-2xl'}>
      <DeleteButton type={DeleteButtonType.comment} comment={comment} />
      <div className={'flex flex-row gap-5'}>
        <UserAvatar profile={comment.author} type={UserAvatarType.comment} />
        <div className={'flex flex-1 flex-col'}>
          <div className={'text-lg'}> {comment.author.username}</div>
          <AttachmentWidget media={comment.media} />
          <div className={'text-md '}>{comment.content}</div>
          <div className={'text-xs text-gray-400'}>
            {new Date(comment.createdAt).toDateString()}
          </div>
        </div>
      </div>
      <LikeButton comment={comment} type={LikeButtonType.comment} />
    </div>
  );
};
