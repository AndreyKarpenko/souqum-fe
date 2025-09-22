import Masonry from '@mui/lab/Masonry';
import { AttachedImage } from '@/features/attachedImage/ui/AttachedImage.tsx';
import type { FC } from 'react';

export const AttachmentWidget: FC<{ media: any[] }> = ({ media }) => {
  return (
    <>
      {!!media.length && (
        <Masonry columns={3} spacing={2}>
          {media.map((media: any) => (
            <AttachedImage url={media.url} />
          ))}
        </Masonry>
      )}
    </>
  );
};
