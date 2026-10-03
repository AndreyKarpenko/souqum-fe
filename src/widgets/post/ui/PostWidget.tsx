import { type FC, useState } from 'react';
import { createPortal } from '@/shared/utils/createPortal.tsx';
import { PostContent } from '@/entities/post';
import { LikeButton } from '@/features/likeButton/ui/LikeButton.tsx';
import { RepostButton } from '@/features/repostButton/ui/RepostButton.tsx';
import { CommentCounter } from '@/features/commentCounter/ui/CommentCounter.tsx';
import { DeleteButton } from '@/features/deletePostButton/ui/DeleteButton.tsx';
import { LikeButtonType } from '@/features/likeButton/model/types.ts';
import { DeleteButtonType } from '@/features/deletePostButton/model/types.ts';
import { AttachmentList } from '@/features/attachedImage/ui/AttachmentList.tsx';
import { AuthorLink } from '@/widgets/post/ui/AuthorLink.tsx';
import { CreatePostModal } from '@/widgets/post/ui/CreatePostModal.tsx';
import { CommentThread } from '@/widgets/post/ui/CommentThread.tsx';

export const PostWidget: FC<{ post: any }> = ({ post }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className={'flex gap-5 flex-col border shadow-xl rounded-2xl p-5'}>
      <div className={'shadow-2xl p-5 rounded-2xl flex flex-col gap-5'}>
        <div className={'flex flex-1'}>
          <PostContent
            post={post}
            renderAuthor={(author, isRepost) => (
              <AuthorLink author={author} size={isRepost ? 'sm' : 'md'} />
            )}
            renderMedia={(media) => <AttachmentList media={media} />}
          />
          <DeleteButton type={DeleteButtonType.post} post={post} />
        </div>
        <div className={'flex gap-2 items-center'}>
          <CommentCounter post={post} />
          <RepostButton post={post} onRepost={() => setShowModal(true)} />
          <LikeButton post={post} type={LikeButtonType.post} />
        </div>
      </div>
      <CommentThread post={post} />
      {showModal &&
        createPortal(<CreatePostModal post={post} onClose={() => setShowModal(false)} />)}
    </div>
  );
};
