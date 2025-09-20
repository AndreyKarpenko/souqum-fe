import { AppButton } from '@/shared/ui/AppButton/AppButton.tsx';
import { createPortal } from '@/shared/utils/createPortal.tsx';
import { useCallback, useEffect, useState } from 'react';
import instance from '@/app/api/apiClient.tsx';
import { useParams } from 'react-router';
import { CreatePostModal } from '@/widgets/CreatePostModal/ui/CreatePostModal.tsx';
import { PostsList } from '@/widgets/PostsList/ui/PostsList.tsx';

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

  const closeModalHandler = () => {
    setShowModal(false);
  };

  useEffect(() => {
    (async () => {
      await loadUsers();
    })();
  }, [loadUsers]);

  useEffect(() => {
    (async () => {
      await getUsersPosts();
    })();
  }, [getUsersPosts]);

  const createPostModal = () => createPortal(<CreatePostModal onClose={closeModalHandler} />);

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
            ) : (
              <AppButton onClick={() => setShowModal(true)} title={'Create New Post'} />
            )}
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

        <PostsList posts={posts} />
      </div>

      {showModal && createPostModal()}
    </div>
  );
};

export default ProfileScreen;
