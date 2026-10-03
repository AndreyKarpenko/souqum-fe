export type StoreCategory = 'food' | 'home' | 'clothing';

export type StoreCategoryFilter = 'all' | StoreCategory;

export type DiscoverCategory = {
  id: StoreCategoryFilter;
  label: string;
};

export type Store = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: StoreCategory;
  likesCount: number;
  isLiked: boolean;
  isFavorite: boolean;
  isSubscribed: boolean;
};

export type StoreAvatarTone =
  | 'warm'
  | 'clay'
  | 'green'
  | 'linen'
  | 'wool'
  | 'oak'
  | 'paper'
  | 'honey'
  | 'navy';

export type StorePostMedia = 'image' | 'video';

export type StorePost = {
  id: string;
  title: string;
  imageUrl: string;
  alt: string;
  caption: string | null;
  tags: string[];
  media: StorePostMedia;
};

export type StoreProfile = Store & {
  bio: string;
  avatarTone: StoreAvatarTone;
  storefrontUrl: string | null;
  conversationId: string | null;
  posts: StorePost[];
};

export type DiscoverFeed = {
  popular: Store[];
  stores: Store[];
  categories: DiscoverCategory[];
};
