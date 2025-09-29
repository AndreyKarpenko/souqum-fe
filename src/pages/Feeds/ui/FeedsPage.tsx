import { useCallback, useEffect, useState } from 'react';
import apiClient from '@/app/api/apiClient.tsx';
import { PostsList } from '@/widgets/PostsList/ui/PostsList.tsx';

export const FeedPage = () => {
  const [posts, setPosts] = useState([]);

  const getUsersPosts = useCallback(async () => {
    const { data: posts } = await apiClient.get(`/posts`);
    setPosts(posts);
  }, []);

  useEffect(() => {
    void getUsersPosts();
  }, [getUsersPosts]);

  return <PostsList posts={posts} />;
};
