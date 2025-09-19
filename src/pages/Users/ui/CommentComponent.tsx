import { type FC } from 'react';
import { useNavigate } from 'react-router';

export const CommentComponent: FC<{ comment: any }> = ({ comment }) => {
  const navigate = useNavigate();
  return (
    <div className={'flex flex-col gap-2 px-5 py-2'}>
      <div className={'flex flex-row items-center gap-5'}>
        <img
          onClick={() => navigate(`/profile/${comment.author.id}`)}
          alt={'user_avatar'}
          src={comment.author.avatar}
          className={'h-10 w-10 rounded-full bg-blue-600'}
        />
        <div> {comment.author.username}</div>
        <div> {new Date(comment.createdAt).toDateString()}</div>
      </div>
      <div>{comment.content}</div>
    </div>
  );
};
