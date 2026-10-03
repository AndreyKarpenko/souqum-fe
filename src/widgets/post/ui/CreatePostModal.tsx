import { AppButton } from '@/shared/ui/AppButton/AppButton.tsx';
import * as React from 'react';
import { type FC, useRef, useState } from 'react';
import { PostContent } from '@/entities/post';
import { UploadImage, type UploadImageRef } from '@/shared/ui/UploadImage/UploadImage.tsx';
import { createPostApi, repostPostApi } from '@/entities/post';
import { AttachmentList } from '@/features/attachedImage/ui/AttachmentList.tsx';
import { AuthorLink } from '@/widgets/post/ui/AuthorLink.tsx';

export const CreatePostModal: FC<{ onClose: () => void; post?: any }> = ({ onClose, post }) => {
  const [postContent, setPostContent] = useState('');
  const [media, setMedia] = useState<File[]>([]);

  const uploadImageRef = useRef<UploadImageRef>(null);

  const repost = async () => {
    await repostPostApi(post?.originalPost?.id ?? post.id, {
      content: postContent,
      title: 'Some Title',
    });
    onClose();
  };

  const addPost = async () => {
    const formData = new FormData();

    media.forEach((file) => formData.append('files', file));
    formData.append('title', 'Some Title');
    formData.append('content', postContent);
    await createPostApi(formData);
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
        {post && (
          <PostContent
            post={post}
            renderAuthor={(author, isRepost) => (
              <AuthorLink author={author} size={isRepost ? 'sm' : 'md'} />
            )}
            renderMedia={(items) => <AttachmentList media={items} />}
          />
        )}

        <textarea onChange={handleTextChange} className={'bg-white p-3 min-h-50 resize-none'} />
        <AppButton onClick={post ? repost : addPost} title={post ? 'Repost' : 'Add post'} />
        <AppButton onClick={uploadImageRef.current?.handleClick} title={'Upload image'} />
        <UploadImage ref={uploadImageRef} onChange={setMedia} />
      </div>
    </div>
  );
};
