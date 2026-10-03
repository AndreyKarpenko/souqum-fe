import type { InboxAvatar } from '@/entities/inbox';

export const inboxAvatarClassName: Record<InboxAvatar, string> = {
  warm: 'bg-[conic-gradient(from_210deg,#F0B27A,#C45C26,#7A3012,#E7C4A2,#F0B27A)]',
  linen: 'bg-[radial-gradient(circle_at_32%_28%,#F8F4EC,#DDD2C2)]',
  cool: 'bg-[conic-gradient(from_220deg,#9B8CFF,#3A2C78,#D5C8FF,#3E62C8,#9B8CFF)]',
};
