import { type FC } from 'react';

export const CommentCounter: FC<{ post: any }> = ({ post }) => {
  return <div>Comments {!!post._count.comments && post._count.comments}</div>;
};
