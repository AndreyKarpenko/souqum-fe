import apiClient from '@/shared/api/apiClient';
import type {
  DiscoverFeed,
  Store,
  StoreCategoryFilter,
  StoreProfile,
} from '@/entities/store/model/types.ts';

const withSignal = (signal?: AbortSignal) => (signal ? { signal } : undefined);

export const getDiscoverApi = async (signal?: AbortSignal): Promise<DiscoverFeed> => {
  const { data } = await apiClient.get<DiscoverFeed>('/discover', withSignal(signal));
  return data;
};

export const getStoresApi = async (
  category: StoreCategoryFilter,
  signal?: AbortSignal
): Promise<Store[]> => {
  const { data } = await apiClient.get<Store[]>('/discover/stores', {
    params: { category },
    ...withSignal(signal),
  });
  return data;
};

export const getStoreApi = async (storeId: string, signal?: AbortSignal): Promise<StoreProfile> => {
  const { data } = await apiClient.get<StoreProfile>(`/stores/${storeId}`, withSignal(signal));
  return data;
};

export const likeStoreApi = async (storeId: string): Promise<Store> => {
  const { data } = await apiClient.post<Store>(`/discover/stores/${storeId}/likes`);
  return data;
};

export const unlikeStoreApi = async (storeId: string): Promise<Store> => {
  const { data } = await apiClient.delete<Store>(`/discover/stores/${storeId}/likes`);
  return data;
};

export const favoriteStoreApi = async (storeId: string): Promise<Store> => {
  const { data } = await apiClient.post<Store>(`/discover/stores/${storeId}/favorite`);
  return data;
};

export const unfavoriteStoreApi = async (storeId: string): Promise<Store> => {
  const { data } = await apiClient.delete<Store>(`/discover/stores/${storeId}/favorite`);
  return data;
};

export const subscribeStoreApi = async (storeId: string): Promise<Store> => {
  const { data } = await apiClient.post<Store>(`/discover/stores/${storeId}/subscription`);
  return data;
};

export const unsubscribeStoreApi = async (storeId: string): Promise<Store> => {
  const { data } = await apiClient.delete<Store>(`/discover/stores/${storeId}/subscription`);
  return data;
};
