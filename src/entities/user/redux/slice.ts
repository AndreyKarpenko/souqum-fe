import { createSlice } from '@reduxjs/toolkit';
import type { UserState } from '@/entities/user/model/types.ts';
import { getMyProfileThunk } from '@/entities/user/redux/thunk.ts';

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
    builder.addMatcher(
      (action) => action.type === 'auth/signOutThunk/fulfilled',
      (state) => {
        state.user = null;
      }
    );
  },
});

export const { reducer: user } = slice;
