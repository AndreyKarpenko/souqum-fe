import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import type { User, UserState } from '@/entities/user/model/types.ts';

const initialState: UserState = {
  user: null,
};

const slice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    setUser: (state: UserState, { payload }: PayloadAction<User>) => {
      state.user = payload;
    },
    removeUser: (state: UserState) => {
      state.user = null;
    },
  },
});

export const {
  actions: { setUser, removeUser },
  reducer: user,
} = slice;
