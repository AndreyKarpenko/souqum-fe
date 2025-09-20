export type User = {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  bio: string | null;
  avatar: string | null;
} | null;

export type UserState = {
  user: User;
};
