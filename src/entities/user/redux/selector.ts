import type { UserState } from '@/entities/user/model/types.ts';

export const userInfoSelector = (state: { user: UserState }) => state.user.user;
