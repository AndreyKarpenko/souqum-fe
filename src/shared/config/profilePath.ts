export const profilePath = (accountId: string, myId?: string | null) =>
  accountId === myId ? '/profile' : `/profile/${accountId}`;
