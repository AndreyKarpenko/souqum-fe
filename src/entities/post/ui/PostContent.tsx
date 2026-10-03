import { type FC, type ReactNode } from 'react';

type PostAuthor = {
  accountId?: string;
  firstName?: string;
  avatar?: string | null;
};

type PostView = {
  author?: PostAuthor;
  content?: string;
  createdAt: string;
  media?: { id: string; url: string }[];
  originalPost?: PostView;
};

type PostContentProps = {
  post: PostView;
  isRepost?: boolean;
  renderAuthor?: (author: PostAuthor, isRepost?: boolean) => ReactNode;
  renderMedia?: (media: { id: string; url: string }[]) => ReactNode;
};

export const PostContent: FC<PostContentProps> = ({ post, isRepost, renderAuthor, renderMedia }) => {
  const author = post.author;

  return (
    <div className={`flex flex-1 flex-col gap-5`}>
      <div className={'flex flex-1 gap-5 items-center'}>
        {author && renderAuthor?.(author, isRepost)}
        <div className={'flex flex-col'}>
          <div className={`${isRepost ? 'text-lg' : 'text-2xl'}`}>{author?.firstName}</div>
          <div className={`${isRepost ? 'text-xs' : 'text-sm'} text-gray-400`}>
            {new Date(post.createdAt).toDateString()}
          </div>
        </div>
      </div>

      {post.originalPost && (
        <div className={'flex flex-col ml-5 pl-5'}>
          <PostContent
            isRepost
            post={post.originalPost}
            renderAuthor={renderAuthor}
            renderMedia={renderMedia}
          />
        </div>
      )}

      {renderMedia?.(post.media ?? [])}

      <div className={'flex flex-1 items-center'}>{post.content}</div>
    </div>
  );
};
