import { createSlice } from '@reduxjs/toolkit';
import {
  checkSessionThunk,
  signInThunk,
  signOutThunk,
  verifyOtpThunk,
} from '@/entities/auth/redux';
import type { AuthState } from '@/entities/auth/model/types.ts';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const initialState: AuthState = {
  is2FAEnabled: false,
  sid: '',
  isLoading: false,
  isAuthenticated: false,
};

const authPersistConfig = {
  key: 'auth',
  storage,
};

const slice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(signInThunk.fulfilled, (state, { payload }) => {
      state.sid = payload.sid;
      state.is2FAEnabled = payload.is2FAEnabled;
      state.isLoading = false;
      if (!payload.is2FAEnabled) {
        state.isAuthenticated = true;
      }
    });
    builder.addCase(signInThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(signInThunk.rejected, (state) => {
      state.is2FAEnabled = false;
      state.sid = '';
      state.isLoading = false;
      state.isAuthenticated = false;
    });

    builder.addCase(verifyOtpThunk.fulfilled, (state) => {
      state.is2FAEnabled = false;
      state.sid = '';
      state.isAuthenticated = true;
      state.isLoading = false;
    });
    builder.addCase(verifyOtpThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(verifyOtpThunk.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(checkSessionThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(checkSessionThunk.fulfilled, (state) => {
      state.isAuthenticated = true;
      state.isLoading = false;
    });
    builder.addCase(checkSessionThunk.rejected, (state) => {
      state.isAuthenticated = false;
      state.isLoading = false;
    });

    builder.addCase(signOutThunk.fulfilled, (state) => {
      state.is2FAEnabled = false;
      state.isAuthenticated = false;
      state.sid = '';
    });
  },
});

export const auth = persistReducer(authPersistConfig, slice.reducer);
