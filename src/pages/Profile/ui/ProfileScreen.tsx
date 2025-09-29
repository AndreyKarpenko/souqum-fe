import { AppButton } from '@/shared/ui/AppButton/AppButton.tsx';
import { createPortal } from '@/shared/utils/createPortal.tsx';
import { useCallback, useEffect, useState } from 'react';
import apiClient from '@/app/api/apiClient.tsx';
import { useNavigate, useParams } from 'react-router';
import { CreatePostModal } from '@/widgets/CreatePostModal/ui/CreatePostModal.tsx';
import { PostsList } from '@/widgets/PostsList/ui/PostsList.tsx';
import { FollowButton } from '@/features/followButton/ui/FollowButton.tsx';
import { useAppDispatch } from '@/app/store/useAppDispatch.ts';
import { getUserProfileApi } from '@/entities/user/api/userService.tsx';
import { getMyProfileThunk } from '@/entities/user/redux/thunk.ts';
import type { User } from '@/entities/user/model/types.ts';
import { SocketApi } from '@/app/configs/socket/socket.ts';

export const ProfileScreen = () => {
  const [showModal, setShowModal] = useState(false);
  const params = useParams();
  const [posts, setPosts] = useState<any[]>([]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
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
    if (user?.id) {
      const { data: posts } = await apiClient.get(`/posts/user/${user?.id}`);
      setPosts(posts);
    }
  }, [user?.id]);

  const closeModalHandler = () => {
    setShowModal(false);
  };

  const createDialog = async () => {
    if (user) {
      const { data } = await apiClient.post(`/dialogs`, { participantIds: [user?.id] });
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
