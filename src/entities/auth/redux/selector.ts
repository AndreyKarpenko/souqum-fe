import type { CoreReduxState } from '@/app/model/types.ts';

export const userTokenSelector = ({ auth }: CoreReduxState) => auth.accessToken;
export const userTokenIsLoadingSelector = ({ auth }: CoreReduxState) => auth.isLoading;
export const userIsLoggedInSelector = ({ auth }: CoreReduxState) => auth.isLoggedIn;
