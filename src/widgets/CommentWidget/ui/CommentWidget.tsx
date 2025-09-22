import { type FC, useCallback, useRef, useState } from 'react';
import { CommentContent } from '@/widgets/CommentContent/ui/CommentContent.tsx';
import { AppInput } from '@/shared/ui/AppInput/AppInput.tsx';
import { AppButton } from '@/shared/ui/AppButton/AppButton.tsx';
import instance from '@/app/api/apiClient.tsx';
import * as React from 'react';
import { UploadImage, type UploadImageRef } from '@/widgets/UploadImage/ui/UploadImage.tsx';

export const CommentWidget: FC<{ post: any }> = ({ post }) => {
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [media, setMedia] = useState<any[]>([]);

  const uploadImageRef = useRef<UploadImageRef>(null);

  const getAllComments = useCallback(async () => {
    if (!showComments) {
      const { data: comments } = await instance.get(`/comments/${post.id}`);
      setComments(comments);
    }
    setShowComments((prevState) => !prevState);
  }, [post.id, showComments]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommentContent(e.target.value);
  };

  const addComment = async (id: string) => {
    const formData = new FormData();

    media.forEach((file) => formData.append('files', file)); // ключ 'files' одинаковый для всех
    formData.append('postId', id);
    formData.append('content', commentContent);

    await instance.post('/comments', formData);
  };

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
        <>
          <div className={'flex flex-col gap-5'}>
            {comments.map((comment) => (
              <CommentContent comment={comment} />
            ))}
          </div>
        </>
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
