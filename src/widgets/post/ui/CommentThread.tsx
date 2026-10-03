import { type FC, useCallback, useEffect, useRef, useState } from 'react';
import { AppInput } from '@/shared/ui/AppInput/AppInput.tsx';
import { AppButton } from '@/shared/ui/AppButton/AppButton.tsx';
import * as React from 'react';
import { UploadImage, type UploadImageRef } from '@/shared/ui/UploadImage/UploadImage.tsx';
import { SocketApi } from '@/shared/api/socket';
import { CommentContent } from '@/entities/comment';
import { createCommentApi, getPostCommentsApi } from '@/entities/comment';
import { LikeButton } from '@/features/likeButton/ui/LikeButton.tsx';
import { LikeButtonType } from '@/features/likeButton/model/types.ts';
import { DeleteButton } from '@/features/deletePostButton/ui/DeleteButton.tsx';
import { DeleteButtonType } from '@/features/deletePostButton/model/types.ts';
import { AttachmentList } from '@/features/attachedImage/ui/AttachmentList.tsx';
import { AuthorLink } from '@/widgets/post/ui/AuthorLink.tsx';

export const CommentThread: FC<{ post: any }> = ({ post }) => {
  const [comments, setComments] = useState<any[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [media, setMedia] = useState<File[]>([]);
  const socket = SocketApi.socket;

  const uploadImageRef = useRef<UploadImageRef>(null);

  const getAllComments = useCallback(async () => {
    if (!showComments) {
      const nextComments = await getPostCommentsApi(post.id);
      setComments(nextComments);
    }
    setShowComments((prevState) => !prevState);
  }, [post.id, showComments]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommentContent(e.target.value);
  };

  const addComment = async (id: string) => {
    setShowComments(true);
    const formData = new FormData();

    media.forEach((file) => formData.append('files', file));
    formData.append('postId', id);
    formData.append('content', commentContent);

    await createCommentApi(formData);
  };

  const handleReceive = (data: any) => {
    setComments((prev) => [...prev, data]);
  };

  const handleRemove = (data: any) => {
    setComments((prev) => prev.filter((item) => item.id !== data));
  };

  useEffect(() => {
    socket?.emit('subscribePostComment', { postId: post.id });
    socket?.on('receiveComment', handleReceive);
    socket?.on('deleteComment', handleRemove);
    return () => {
      socket?.emit('unsubscribePostComment', { postId: post.id });
      socket?.off('receiveComment', handleReceive);
      socket?.off('deleteComment', handleRemove);
    };
  }, [post.id, socket]);

  return (
    <>
      {!!post._count.comments && (
        <div
          className={'cursor-pointer text-center text-gray-400 gap-2 flex items-center'}
          onClick={getAllComments}
        >
          <div className={'flex flex-1 h-[2px] bg-gray-400'} />
          {showComments ? 'Hide Comments' : 'Show comments'}
          <div className={'flex flex-1 h-[2px] bg-gray-400'} />
        </div>
      )}
      {showComments && (
        <div className={'flex flex-col gap-5'}>
          {comments.map((comment) => (
            <div
              key={comment.id}
              className={'flex flex-col gap-2 mx-5 px-5 py-2 shadow-lg rounded-2xl'}
            >
              <DeleteButton type={DeleteButtonType.comment} comment={comment} />
              <CommentContent
                comment={comment}
                renderAuthor={(author) => <AuthorLink author={author} />}
                renderMedia={(items) => <AttachmentList media={items} />}
              />
              <LikeButton comment={comment} type={LikeButtonType.comment} />
            </div>
          ))}
        </div>
      )}
      <div className={'gap-5 mx-5 flex flex-row'}>
        <AppInput onChange={handleChange} title={''} />
        <div className={'flex gap-5'}>
          <AppButton onClick={uploadImageRef.current?.handleClick} title={'Upload image'} />
          <AppButton onClick={() => addComment(post.id)} title={'Add comment'} />
        </div>
      </div>
      <div className={'mx-5'}>
        <UploadImage ref={uploadImageRef} onChange={setMedia} />
      </div>
    </>
  );
};
