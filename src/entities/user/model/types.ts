export type User = {
  accountId: string;
  email: string;
  firstName: string;
  lastName: string;
  bio: string | null;
  avatar: string | null;
};

export type UserState = {
  user: User | null;
};
