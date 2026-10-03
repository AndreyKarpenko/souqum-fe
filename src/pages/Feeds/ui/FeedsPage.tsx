import { useCallback, useEffect, useState } from 'react';
import { PostsList } from '@/widgets/post/ui/PostsList.tsx';
import { getPostsApi } from '@/entities/post';

export const FeedPage = () => {
  const [posts, setPosts] = useState([]);

  const getUsersPosts = useCallback(async () => {
    const posts = await getPostsApi();
    setPosts(posts);
  }, []);

  useEffect(() => {
    void getUsersPosts();
  }, [getUsersPosts]);

  return <PostsList posts={posts} />;
};
