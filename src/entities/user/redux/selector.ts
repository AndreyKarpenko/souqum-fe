import type { CoreReduxState } from '@/app/model/types.ts';

export const userInfoSelector = ({ user }: CoreReduxState) => user.user;
