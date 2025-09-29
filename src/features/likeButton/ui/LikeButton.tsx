import { type FC, useMemo } from 'react';
import apiClient from '@/app/api/apiClient.tsx';
import { LikeButtonType } from '@/features/likeButton/model/types.ts';

export const LikeButton: FC<{ post?: any; comment?: any; message?: any; type: LikeButtonType }> = ({
  post,
  comment,
  message,
  type,
}) => {
  const likeUnlikePost = async () => {
    if (post.isLiked) {
      await apiClient.delete(`/likes/post/${post.id}`);
    } else {
      await apiClient.post(`/likes/post/${post.id}`);
    }
  };

  const likeUnlikeComment = async () => {
    if (comment.isLiked) {
      await apiClient.delete(`/likes/comment/${comment.id}`);
    } else {
      await apiClient.post(`/likes/comment/${comment.id}`);
    }
  };

  const count = useMemo(() => {
    switch (type) {
      case LikeButtonType.post:
        return !!post._count.likes && post._count.likes;
      case LikeButtonType.comment:
        return !!comment._count.likes && comment._count.likes;
      case LikeButtonType.message:
        return !!message._count.likes && message._count.likes;
      default:
        return '';
    }
  }, [comment, message, post, type]);

  const likeHandler = () => {
    switch (type) {
      case LikeButtonType.post:
        void likeUnlikePost();
        break;
      case LikeButtonType.comment:
        void likeUnlikeComment();
        break;
      case LikeButtonType.message:
        break;
      default:
        break;
    }
  };

  const likeStyle = useMemo(() => {
    switch (type) {
      case LikeButtonType.post:
        return post.isLiked ? 'text-blue-400' : 'text-black';
      case LikeButtonType.comment:
        return comment.isLiked ? 'text-blue-400' : 'text-black';
      case LikeButtonType.message:
        return message.isLiked ? 'text-blue-400' : 'text-black';
      default:
        return '';
    }
  }, [comment, message, post, type]);

  return (
    <div className={`cursor-pointer ${likeStyle}`} onClick={likeHandler}>
      Like {count}
    </div>
  );
};
