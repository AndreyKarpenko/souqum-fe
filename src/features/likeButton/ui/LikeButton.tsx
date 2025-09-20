import { type FC } from 'react';
import instance from '@/app/api/apiClient.tsx';

export const LikeButton: FC<{ post: any }> = ({ post }) => {
  const likeUnlikePost = async () => {
    if (post.isLiked) {
      await instance.delete(`/likes/post/${post.id}`);
    } else {
      await instance.post(`/likes/post/${post.id}`);
    }
  };

  return (
    <div
      className={`cursor-pointer ${post.isLiked ? 'text-blue-400' : 'text-black'}`}
      onClick={likeUnlikePost}
    >
      Like {!!post._count.likes && post._count.likes}
    </div>
  );
};
