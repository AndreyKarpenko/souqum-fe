import { type FC } from 'react';
import { PostComponent } from '@/pages/Users/ui/PostComponent.tsx';

export const UsersListPage: FC<{ posts: any[] }> = ({ posts = [] }) => {
  return (
    <div className={'flex flex-1 flex-col gap-5'}>
      {posts.map((post) => (
        <PostComponent post={post} />
      ))}
    </div>
  );
};
