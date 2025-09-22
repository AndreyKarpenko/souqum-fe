import { type FC, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getUserSelector } from '@/entities/user/redux';
import instance from '@/app/api/apiClient.tsx';
import { DeleteButtonType } from '@/features/deletePostButton/model/types.ts';

export const DeleteButton: FC<{
  post?: any;
  comment?: any;
  message?: any;
  type: DeleteButtonType;
}> = ({ post, comment, message, type }) => {
  const user = useSelector(getUserSelector);

  const removeHandler = () => {
    switch (type) {
      case DeleteButtonType.post:
        void instance.delete(`/posts/${post.id}`);
        break;
      case DeleteButtonType.comment:
        void instance.delete(`/comments/${comment.id}`);
        break;
      case DeleteButtonType.message:
        break;
      default:
        break;
    }
  };

  const canDelete = useMemo(() => {
    switch (type) {
      case DeleteButtonType.post:
        return post?.author.id === user?.id;
      case DeleteButtonType.comment:
        return comment?.author.id === user?.id;
      case DeleteButtonType.message:
        return message?.author.id === user?.id;
      default:
        return;
    }
  }, [post, comment, message, type, user?.id]);

  return (
    <div className={'relative'}>
      {canDelete && (
        <div
          onClick={removeHandler}
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
