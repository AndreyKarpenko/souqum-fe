import { type FC, useState } from 'react';
import { createPortal } from '@/shared/utils/createPortal.tsx';
import { CreatePostModal } from '@/widgets/CreatePostModal/ui/CreatePostModal.tsx';
import { useSelector } from 'react-redux';
import { userInfoSelector } from '@/entities/user/redux';

export const RepostButton: FC<{ post: any }> = ({ post }) => {
  const [showModal, setShowModal] = useState(false);
  const user = useSelector(userInfoSelector);

  const closeModalHandler = () => {
    setShowModal(false);
  };

  const repostPostModal = () =>
    createPortal(<CreatePostModal post={post} onClose={closeModalHandler} />);

  return (
    <div>
      {user?.id !== post.author.id && (
        <div
          className={`${post.isReposted ? 'text-blue-400' : 'cursor-pointer text-black'}`}
          onClick={() => {
            if (!post.isReposted) {
              setShowModal(true);
            }
          }}
        >
          Repost {!!post._count.reposts && post._count.reposts}
        </div>
      )}
      {showModal && repostPostModal()}
    </div>
  );
};
