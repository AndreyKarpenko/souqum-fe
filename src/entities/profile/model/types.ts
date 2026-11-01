export type ProfilePost = {
  id: string;
  title: string;
  imageUrl: string;
  alt: string;
  attribution: string;
};

export type ProfileShelfItem = {
  id: string;
  title: string;
  imageUrl: string;
  alt: string;
  href: string;
};

export type ProfileStoreCard = {
  id: string;
  name: string;
  summary: string;
  imageUrl: string;
  alt: string;
};

export type ProfileDraft = {
  imageUrl: string;
  imageAlt: string;
  text: string;
};

export type ProfileAside = {
  title: string;
  text: string;
};

export type SocialProfile = {
  id: string;
  firstName: string;
  lastName: string;
  handle: string;
  city: string;
  bio: string;
  bioShort: string;
  initial: string;
  avatarUrl: string | null;
  coverUrl: string;
  coverAlt: string;
  postsCount: number;
  followersCount: number;
  isMine: boolean;
  isFollowing: boolean;
  shelfPublic: boolean;
  posts: ProfilePost[];
  shelf: ProfileShelfItem[];
  stores: ProfileStoreCard[];
  draft: ProfileDraft | null;
  postsAside: ProfileAside;
  shelfAside: ProfileAside;
};

export type PublishProfilePostInput = {
  text: string;
  imageUrl?: string;
};
