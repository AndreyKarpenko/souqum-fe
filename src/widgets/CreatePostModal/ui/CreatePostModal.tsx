import { AppButton } from '@/shared/ui/AppButton/AppButton.tsx';
import * as React from 'react';
import { type FC, useState } from 'react';
import instance from '@/app/api/apiClient.tsx';
import { PostContent } from '@/widgets/PostContent/ui/PostContent.tsx';

export const CreatePostModal: FC<{ onClose: () => void; post?: any }> = ({ onClose, post }) => {
  const [postContent, setPostContent] = useState('');

  const repost = async () => {
    await instance.post(`/posts/repost/${post?.originalPost?.id ?? post.id}`, {
      content: postContent,
      title: 'Some Title',
    });
    onClose();
  };

  const addPost = async () => {
    await instance.post('/posts', {
      title: `Post`,
      content: postContent,
    });
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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

        <textarea onChange={handleChange} className={'bg-white p-3 min-h-50 resize-none'} />
        <AppButton onClick={post ? repost : addPost} title={post ? 'Repost' : 'Add post'} />
      </div>
    </div>
  );
};
