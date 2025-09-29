import { createSlice } from '@reduxjs/toolkit';
import type { UserState } from '@/entities/user/model/types.ts';
import { getMyProfileThunk } from '@/entities/user/redux/thunk.ts';
import { signOutThunk } from '@/entities/auth/redux';

const initialState: UserState = {
  user: null,
};

const slice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getMyProfileThunk.fulfilled, (state, { payload }) => {
      state.user = payload;
    });
    builder.addCase(signOutThunk.fulfilled, (state) => {
      state.user = null;
    });
  },
});

export const { reducer: user } = slice;
