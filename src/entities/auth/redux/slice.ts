import { createSlice } from '@reduxjs/toolkit';
import { refreshTokenThunk, signInThunk, signOutThunk } from '@/entities/auth/redux';
import type { AuthState } from '@/entities/auth/model/types.ts';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const initialState: AuthState = {
  accessToken: null,
  isLoading: true,
  isLoggedIn: false,
};

const authPersistConfig = {
  key: 'auth',
  whitelist: ['isLoggedIn'],
  storage,
};

const slice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(signInThunk.fulfilled, (state, { payload }) => {
      state.accessToken = payload;
      state.isLoading = false;
      state.isLoggedIn = true;
    });
    builder.addCase(signInThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(signInThunk.rejected, (state) => {
      state.accessToken = null;
      state.isLoading = false;
      state.isLoggedIn = false;
    });

    builder.addCase(refreshTokenThunk.fulfilled, (state, { payload }) => {
      state.accessToken = payload;
      state.isLoading = false;
      state.isLoggedIn = true;
    });
    builder.addCase(refreshTokenThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(refreshTokenThunk.rejected, (state) => {
      state.accessToken = null;
      state.isLoading = false;
      state.isLoggedIn = false;
    });

    builder.addCase(signOutThunk.fulfilled, (state) => {
      state.accessToken = null;
      state.isLoggedIn = false;
    });
  },
});

export const auth = persistReducer(authPersistConfig, slice.reducer);
