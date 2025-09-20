import { useCallback, useEffect, useState } from 'react';
import instance from '@/app/api/apiClient.tsx';
import { PostsList } from '@/widgets/PostsList/ui/PostsList.tsx';

export const FeedPage = () => {
  const [posts, setPosts] = useState([]);

  const getUsersPosts = useCallback(async () => {
    const { data: posts } = await instance.get(`/posts`);
    setPosts(posts);
  }, []);

  useEffect(() => {
    void getUsersPosts();
  }, [getUsersPosts]);

  return <PostsList posts={posts} />;
};
