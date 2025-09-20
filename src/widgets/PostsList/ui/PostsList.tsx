import { type FC } from 'react';
import { PostWidget } from '@/widgets/PostWidget/ui/PostWidget.tsx';

export const PostsList: FC<{ posts: any[] }> = ({ posts = [] }) => {
  return (
    <div className={'flex flex-1 flex-col gap-5'}>
      {posts.map((post) => (
        <PostWidget post={post} />
      ))}
    </div>
  );
};
