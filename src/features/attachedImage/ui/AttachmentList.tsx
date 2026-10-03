import Masonry from '@mui/lab/Masonry';
import { AttachedImage } from '@/features/attachedImage/ui/AttachedImage.tsx';
import type { FC } from 'react';

export const AttachmentList: FC<{ media?: { id: string; url: string }[] }> = ({ media = [] }) => {
  if (!media.length) return null;

  return (
    <Masonry columns={3} spacing={2}>
      {media.map((item) => (
        <AttachedImage key={item.id} url={item.url} />
      ))}
    </Masonry>
  );
};
