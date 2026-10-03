import { type FC, type ReactNode } from 'react';

type CommentAuthor = {
  accountId?: string;
  firstName?: string;
  avatar?: string | null;
};

type CommentContentProps = {
  comment: {
    author?: CommentAuthor;
    content?: string;
    createdAt: string;
    media?: { id: string; url: string }[];
  };
  renderAuthor?: (author: CommentAuthor) => ReactNode;
  renderMedia?: (media: { id: string; url: string }[]) => ReactNode;
};

export const CommentContent: FC<CommentContentProps> = ({ comment, renderAuthor, renderMedia }) => {
  return (
    <div className={'flex flex-row gap-5'}>
      {comment.author && renderAuthor?.(comment.author)}
      <div className={'flex flex-1 flex-col'}>
        <div className={'text-lg'}> {comment.author?.firstName}</div>
        {renderMedia?.(comment.media ?? [])}
        <div className={'text-md '}>{comment.content}</div>
        <div className={'text-xs text-gray-400'}>{new Date(comment.createdAt).toDateString()}</div>
      </div>
    </div>
  );
};
