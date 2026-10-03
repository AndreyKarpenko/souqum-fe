import { type FC } from 'react';

export const ImageViewModal: FC<{ onClose: () => void; url: string }> = ({ onClose, url }) => {
  return (
    <div
      onClick={onClose}
      className={'fixed inset-0 flex items-center justify-center bg-[#000000dd]'}
    >
      <div
        className={
          'flex rounded-md max-h-[95vh] h-fit w-fit max-w-[60vw] flex-col gap-4 bg-red-200 overflow-scroll'
        }
      >
        <img src={url} alt="image" className="max-h-[90vh] max-w-[90vw] object-contain rounded" />
      </div>
    </div>
  );
};
