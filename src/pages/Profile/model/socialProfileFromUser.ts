import type { SocialProfile } from '@/entities/profile';
import roast from '@/pages/Landing/assets/content-roast.png';

const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

const firstFilled = (...values: unknown[]) => {
  for (const value of values) {
    const text = asText(value);
    if (text) return text;
  }
  return '';
};

export const socialProfileFromUser = (raw: unknown): SocialProfile | null => {
  if (!raw || typeof raw !== 'object') return null;

  const user = raw as Record<string, unknown>;
  const id = asText(user.accountId);
  if (!id) return null;

  const firstName = asText(user.firstName) || asText(user.firstname) || 'Користувач';
  const lastName = asText(user.lastName);
  const bio = asText(user.bio) || asText(user.about) || 'Пости публікує від себе.';
  const avatar = asText(user.avatar);
  const initial = firstName.charAt(0).toUpperCase() || '•';

  return {
    id,
    firstName,
    lastName,
    handle: id.length <= 24 && /^[\w.-]+$/.test(id) ? id : firstName.toLowerCase(),
    city: '',
    bio,
    bioShort: bio,
    initial,
    avatarUrl: avatar || null,
    coverUrl: roast,
    coverAlt: firstName,
    postsCount: 0,
    followersCount: 0,
    isMine: id === 'olena',
    isFollowing: false,
    shelfPublic: true,
    posts: [],
    shelf: [],
    stores: [],
    draft: null,
    postsAside: {
      title: 'Пости',
      text: 'Публікує від себе. Підписатися і написати — тут.',
    },
    shelfAside: {
      title: 'Полиця',
      text: 'Магазини і товари, які збережені. Чеків тут немає.',
    },
  };
};

export const mergeOwnProfile = (base: SocialProfile, raw: unknown): SocialProfile => {
  if (!raw || typeof raw !== 'object') return { ...base, isMine: true };

  const user = raw as Record<string, unknown>;
  const id = firstFilled(user.accountId, base.id);
  const firstName = firstFilled(user.firstName, user.firstname, base.firstName);
  const lastName = firstFilled(user.lastName, base.lastName);
  const bio = firstFilled(user.bio, user.about, base.bio);
  const uploadedAvatar = base.avatarUrl?.startsWith('data:') ? base.avatarUrl : '';
  const avatarUrl = firstFilled(uploadedAvatar, user.avatar, base.avatarUrl) || null;

  return {
    ...base,
    id,
    firstName,
    lastName,
    handle: firstFilled(user.handle, id === base.id ? base.handle : firstName.toLowerCase()),
    city: firstFilled(user.city, base.city),
    bio,
    bioShort: firstFilled(user.bioShort, user.about, user.bio, base.bioShort),
    initial: firstName.charAt(0).toUpperCase() || base.initial,
    avatarUrl,
    isMine: true,
  };
};
