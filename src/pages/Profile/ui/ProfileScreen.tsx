import { AppButton } from '@/shared/ui/AppButton/AppButton.tsx';
import { createPortal } from '@/shared/utils/createPortal.tsx';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { CreatePostModal } from '@/widgets/post/ui/CreatePostModal.tsx';
import { PostsList } from '@/widgets/post/ui/PostsList.tsx';
import { FollowButton } from '@/features/followButton/ui/FollowButton.tsx';
import { useThunkDispatch } from '@/shared/lib/useThunkDispatch.ts';
import { createDialogApi } from '@/entities/dialog';
import { getUserPostsApi } from '@/entities/post';
import { getUserProfileApi } from '@/entities/user';
import { getMyProfileThunk } from '@/entities/user';
import type { User } from '@/entities/user';
import { SocketApi } from '@/shared/api/socket';

export const ProfileScreen = () => {
  const [showModal, setShowModal] = useState(false);
  const params = useParams();
  const [posts, setPosts] = useState<any[]>([]);
  const navigate = useNavigate();
  const dispatch = useThunkDispatch();
  const [user, setUser] = useState<User | null>(null);

  const loadUsers = useCallback(async () => {
    if (params.id) {
      const user = await getUserProfileApi(params.id);
      setUser(user);
    } else {
      const me = await dispatch(getMyProfileThunk()).unwrap();
      setUser(me);
    }
  }, [dispatch, params.id]);

  const getUsersPosts = useCallback(async () => {
    if (user?.accountId) {
      const posts = await getUserPostsApi(user.accountId);
      setPosts(posts);
    }
  }, [user?.accountId]);

  const closeModalHandler = () => {
    setShowModal(false);
  };

  const createDialog = async () => {
    if (user) {
      const data = await createDialogApi([user.accountId]);
      navigate(`/messages/${data?.id}`);
    }
  };

  const receiveHandler = (data: any) => {
    setPosts((prevState) => [...prevState, data]);
  };

  const deleteHandler = (data: any) => {
    setPosts((prevState) => prevState.filter((item) => item.id !== data));
  };

  const socket = SocketApi.socket;

  useEffect(() => {
    socket?.on('receiveMessage', () => {});
    socket?.on('receivePost', receiveHandler);
    socket?.on('deletePost', deleteHandler);
    return () => {
      socket?.off('receiveMessage', () => {});
      socket?.off('receivePost', receiveHandler);
      socket?.off('deletePost', deleteHandler);
    };
  }, [params.id, socket]);

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
    <div className={'flex flex-1 flex-col gap-5'}>
      <div className={'h-[60vh] flex flex-col gap-5'}>
        <div className={'flex bg-blue-300 rounded-2xl'}>
          <div className={'flex flex-1 flex-col justify-between'}>
            {params.id ? (
              <>
                <FollowButton user={user} />
                <AppButton onClick={createDialog} title={'Send message'} />
                <AppButton onClick={() => {}} title={'See stores'} />
              </>
            ) : (
              <AppButton onClick={() => setShowModal(true)} title={'Create New Post'} />
            )}
          </div>
          <div className={'flex flex-1'} />
          <div className={'flex flex-1 flex-col justify-end'}>
            {user?.avatar ? (
              <img
                alt={'user_avatar'}
                className={'h-full aspect-square rounded-full bg-white'}
                src={user?.avatar}
              />
            ) : null}
          </div>
          <div className={'flex flex-1'} />
          <div className={'flex flex-1 flex-col justify-end'} />
        </div>
        <div className={'flex flex-1 gap-5 bg-yellow-200'}></div>
      </div>
      <PostsList posts={posts} />
      {showModal && createPostModal()}
    </div>
  );
};

export default ProfileScreen;
