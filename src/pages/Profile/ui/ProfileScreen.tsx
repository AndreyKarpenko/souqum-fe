import { AppButton } from '@/shared/ui/AppButton/AppButton.tsx';
import { createPortal } from '@/shared/utils/createPortal.tsx';
import { useCallback, useEffect, useState } from 'react';
import instance from '@/app/api/apiClient.tsx';
import { useParams } from 'react-router';
import { AppInput } from '@/shared/ui/AppInput/AppInput.tsx';
import * as React from 'react';
import { UsersListPage } from '@/pages/Users/ui/UsersListPage.tsx';

export const ProfileScreen = () => {
  const [showModal, setShowModal] = useState(false);
  const params = useParams();
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState([]);

  const loadUsers = useCallback(async () => {
    if (params.id) {
      const { data } = await instance.get(`/account/${params.id}`);
      setUser(data);
    } else {
      const { data } = await instance.get(`/account/me`);
      setUser(data);
    }
  }, [params]);

  const follow = async () => {
    await instance.post('subscriptions/follow', {
      followingId: user?.id,
    });
    await loadUsers();
  };

  const unfollow = async () => {
    await instance.post('subscriptions/unfollow', {
      followingId: user?.id,
    });
    await loadUsers();
  };

  const getUsersPosts = useCallback(async () => {
    if (user.id) {
      const { data: posts } = await instance.get(`/posts/user/${user?.id}`);
      setPosts(posts);
    }
  }, [user?.id]);

  const [postContent, setPostContent] = useState('');

  const addPost = async () => {
    await instance.post('/posts', {
      title: `${user.username} ${user.username} Post`,
      content: postContent,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostContent(e.target.value);
  };

  useEffect(() => {
    (async () => {
      await loadUsers();
      await getUsersPosts();
    })();
  }, [getUsersPosts, loadUsers]);

  const seeStores = () =>
    createPortal(
      <div className={'absolute inset-0 flex items-center justify-center bg-[#00000090]'}>
        <div
          onClick={() => setShowModal(false)}
          className={'h-[300px] w-[300px] grid gap-4 bg-red-200 overflow-scroll'}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <div
              className={
                'flex items-center justify-center h-[50px] w-[50px] bg-blue-200 border border-black'
              }
            >
              {i}
            </div>
          ))}
        </div>
      </div>
    );

  return (
    <div className={'flex flex-1 gap-5'}>
      <div className={'flex flex-5 flex-col gap-5'}>
        <div className={'flex flex-2 bg-blue-300 rounded-2xl'}>
          <div className={'flex flex-1 flex-col gap-5 justify-end'}>
            {params.id ? (
              <>
                {user?.isFollowed ? (
                  <AppButton onClick={unfollow} title={'UnFollow'} />
                ) : (
                  <AppButton onClick={follow} title={'Follow'} />
                )}
                <AppButton onClick={() => {}} title={'Send message'} />
                <AppButton onClick={() => setShowModal(true)} title={'See stores'} />
              </>
            ) : null}
          </div>
          <div className={'flex flex-1'} />
          <div className={'flex flex-1 flex-col justify-end'}>
            <img
              alt={'user_avatar'}
              className={'w-full aspect-square rounded-full bg-white'}
              src={user?.avatar}
            />
          </div>
          <div className={'flex flex-1'} />
          <div className={'flex flex-1 flex-col justify-end'} />
        </div>
        <div className={'flex flex-5 gap-5 bg-yellow-200'}></div>
        {!params.id && (
          <>
            <AppInput onChange={handleChange} title={'Your post'} />
            <AppButton onClick={addPost} title={'Add post'} />
          </>
        )}

        <UsersListPage posts={posts} />
      </div>

      {showModal && seeStores()}
    </div>
  );
};

export default ProfileScreen;
