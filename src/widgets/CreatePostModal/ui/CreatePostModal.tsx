import { AppButton } from '@/shared/ui/AppButton/AppButton.tsx';
import * as React from 'react';
import { type FC, useRef, useState } from 'react';
import apiClient from '@/app/api/apiClient.tsx';
import { PostContent } from '@/widgets/PostContent/ui/PostContent.tsx';
import { UploadImage, type UploadImageRef } from '@/widgets/UploadImage/ui/UploadImage.tsx';

export const CreatePostModal: FC<{ onClose: () => void; post?: any }> = ({ onClose, post }) => {
  const [postContent, setPostContent] = useState('');
  const [media, setMedia] = useState<File[]>([]);

  const uploadImageRef = useRef<UploadImageRef>(null);

  const repost = async () => {
    await apiClient.post(`/posts/repost/${post?.originalPost?.id ?? post.id}`, {
      content: postContent,
      title: 'Some Title',
    });
    onClose();
  };

  const addPost = async () => {
    const formData = new FormData();

    media.forEach((file) => formData.append('files', file)); // ключ 'files' одинаковый для всех
    formData.append('title', 'Some Title');
    formData.append('content', postContent);
    await apiClient.post('/posts', formData);
    onClose();
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostContent(e.target.value);
  };

  return (
    <div
      onClick={onClose}
      className={'fixed inset-0 flex items-center justify-center bg-[#00000090]'}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={
          'flex rounded-4xl p-10 max-h-[95vh] h-fit w-[50vw] flex-col gap-4 bg-red-200 overflow-scroll'
        }
      >
        {post && <PostContent post={post} />}

        <textarea onChange={handleTextChange} className={'bg-white p-3 min-h-50 resize-none'} />
        <AppButton onClick={post ? repost : addPost} title={post ? 'Repost' : 'Add post'} />
        <AppButton onClick={uploadImageRef.current?.handleClick} title={'Upload image'} />
        <UploadImage ref={uploadImageRef} onChange={setMedia} />
      </div>
    </div>
  );
};
