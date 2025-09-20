import type { CoreReduxState } from '@/app/model/types.ts';

export const getUserSelector = ({ user }: CoreReduxState) => user.user;
