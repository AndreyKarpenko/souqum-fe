import type { CoreReduxState } from '@/app/model/types.ts';

export const userTokenIsLoadingSelector = ({ auth }: CoreReduxState) => auth.isLoading;
export const userIsAuthenticatedSelector = ({ auth }: CoreReduxState) => auth.isAuthenticated;
export const userSidSelector = ({ auth }: CoreReduxState) => auth.sid;
