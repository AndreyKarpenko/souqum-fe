import Masonry from '@mui/lab/Masonry';
import { AttachedImage } from '@/features/attachedImage/ui/AttachedImage.tsx';
import type { FC } from 'react';

export const AttachmentWidget: FC<{ attachment: any[] }> = ({ attachment }) => {
  return (
    <>
      {!!attachment.length && (
        <Masonry columns={Math.min(attachment.length, 3)} spacing={2}>
          {attachment.map((attachment: any) => (
            <AttachedImage url={attachment.media.url} />
          ))}
        </Masonry>
      )}
    </>
  );
};
