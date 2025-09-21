import type { FC } from 'react';
import { useSelector } from 'react-redux';
import { getUserSelector } from '@/entities/user/redux';
import instance from '@/app/api/apiClient.tsx';

export const DeletePostButton: FC<{ post: any }> = ({ post }) => {
  const user = useSelector(getUserSelector);

  const deletePost = async () => {
    await instance.delete(`/posts/${post.id}`);
  };

  return (
    <div className={'relative'}>
      {post.author.id === user?.id && (
        <div
          onClick={deletePost}
          className={
            'absolute right-0 cursor-pointer h-5 w-5 flex items-center justify-center rounded-full'
          }
        >
          X
        </div>
      )}
    </div>
  );
};
