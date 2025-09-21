import { type FC, useState } from 'react';
import { createPortal } from '@/shared/utils/createPortal.tsx';
import { ImageViewModal } from '@/widgets/ImageViewModal/ui/ImageViewModal.tsx';

export const AttachedImage: FC<{ url: string }> = ({ url }) => {
  const [showModal, setShowModal] = useState(false);

  const closeModalHandler = () => {
    setShowModal(false);
  };

  const repostPostModal = () =>
    createPortal(<ImageViewModal url={url} onClose={closeModalHandler} />);

  return (
    <div>
      <img className={'rounded-sm'} onClick={() => setShowModal(true)} alt={'image'} src={url} />
      {showModal && repostPostModal()}
    </div>
  );
};
