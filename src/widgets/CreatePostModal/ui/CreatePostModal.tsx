import { AppButton } from '@/shared/ui/AppButton/AppButton.tsx';
import * as React from 'react';
import { type FC, useRef, useState } from 'react';
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
    const formData = new FormData();

    attachments.forEach((file) => formData.append('files', file)); // ключ 'files' одинаковый для всех
    formData.append('title', 'Some Title');
    formData.append('content', postContent);

    await instance.post('/posts', formData);
    onClose();
  };

  const [attachments, setAttachments] = useState<File[]>([]);

  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostContent(e.target.value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAttachments((prevState) => {
      if (e.target.files) {
        return [...prevState, ...e.target.files];
      }
      return prevState;
    });
  };

  const deleteAttachmentHandler = (index: number) => {
    setAttachments((prevState) => prevState.filter((_, i) => i !== index));
  };

  const handleClick = () => {
    inputFileRef.current?.click();
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
        <AppButton onClick={handleClick} title={'Upload image'} />
        {!!attachments.length && (
          <div className={'flex flex-1 flex-row gap-4 flex-wrap'}>
            {attachments?.map((attachment, index) => (
              <div className={'relative'}>
                <div
                  onClick={() => deleteAttachmentHandler(index)}
                  className={
                    'cursor-pointer absolute text-xs right-[-8px] top-[-8px] h-[16px] w-[16px] flex items-center justify-center rounded-full bg-amber-400'
                  }
                >
                  x
                </div>
                <img alt={'image'} src={URL.createObjectURL(attachment)} className={'h-10 w-10'} />
              </div>
            ))}
          </div>
        )}

        <input
          multiple
          ref={inputFileRef}
          className={'hidden'}
          type={'file'}
          accept={'image/*'}
          onChange={handleImageChange}
        />
      </div>
    </div>
  );
};
