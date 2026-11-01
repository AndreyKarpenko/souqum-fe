import apiClient from '@/shared/api/apiClient';
import type { PublishProfilePostInput, SocialProfile } from '@/entities/profile/model/types.ts';

const withSignal = (signal?: AbortSignal) => (signal ? { signal } : undefined);

export const getMySocialProfileApi = async (signal?: AbortSignal): Promise<SocialProfile> => {
  const { data } = await apiClient.get<SocialProfile>('/profiles/me', withSignal(signal));
  return data;
};

export const getSocialProfileApi = async (
  profileId: string,
  signal?: AbortSignal
): Promise<SocialProfile> => {
  const { data } = await apiClient.get<SocialProfile>(`/profiles/${profileId}`, withSignal(signal));
  return data;
};

export const publishProfilePostApi = async (input: PublishProfilePostInput): Promise<SocialProfile> => {
  const { data } = await apiClient.post<SocialProfile>('/profiles/me/posts', input);
  return data;
};

export const setShelfVisibilityApi = async (isPublic: boolean): Promise<SocialProfile> => {
  const { data } = await apiClient.patch<SocialProfile>('/profiles/me/shelf', { public: isPublic });
  return data;
};

export const followProfileApi = async (profileId: string): Promise<SocialProfile> => {
  const { data } = await apiClient.post<SocialProfile>(`/profiles/${profileId}/follow`);
  return data;
};

export const unfollowProfileApi = async (profileId: string): Promise<SocialProfile> => {
  const { data } = await apiClient.delete<SocialProfile>(`/profiles/${profileId}/follow`);
  return data;
};

export const updateProfileAvatarApi = async (imageUrl: string): Promise<SocialProfile> => {
  const { data } = await apiClient.patch<SocialProfile>('/profiles/me/avatar', { imageUrl });
  return data;
};
