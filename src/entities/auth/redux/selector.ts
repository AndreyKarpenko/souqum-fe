import type { AuthState } from '@/entities/auth/model/types.ts';

export const userTokenIsLoadingSelector = (state: { auth: AuthState }) => state.auth.isLoading;
export const userIsAuthenticatedSelector = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;
export const userSidSelector = (state: { auth: AuthState }) => state.auth.sid;
