import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState } from '@/entities/auth/model/types.ts';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

type SignInResult = { is2FAEnabled: boolean; sid?: string };

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
    builder.addMatcher(
      (action): action is PayloadAction<SignInResult> => action.type === 'auth/signInThunk/fulfilled',
      (state, { payload }) => {
        state.sid = payload.sid;
        state.is2FAEnabled = payload.is2FAEnabled;
        state.isLoading = false;
        if (!payload.is2FAEnabled) {
          state.isAuthenticated = true;
        }
      }
    );
    builder.addMatcher(
      (action) => action.type === 'auth/signInThunk/pending',
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      (action) => action.type === 'auth/signInThunk/rejected',
      (state) => {
        state.is2FAEnabled = false;
        state.sid = '';
        state.isLoading = false;
        state.isAuthenticated = false;
      }
    );

    builder.addMatcher(
      (action) => action.type === 'auth/verifyOtpThunk/fulfilled',
      (state) => {
        state.is2FAEnabled = false;
        state.sid = '';
        state.isAuthenticated = true;
        state.isLoading = false;
      }
    );
    builder.addMatcher(
      (action) => action.type === 'auth/verifyOtpThunk/pending',
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      (action) => action.type === 'auth/verifyOtpThunk/rejected',
      (state) => {
        state.isLoading = false;
      }
    );

    builder.addMatcher(
      (action) => action.type === 'auth/checkSession/pending',
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      (action) => action.type === 'auth/checkSession/fulfilled',
      (state) => {
        state.isAuthenticated = true;
        state.isLoading = false;
      }
    );
    builder.addMatcher(
      (action) => action.type === 'auth/checkSession/rejected',
      (state) => {
        state.isAuthenticated = false;
        state.isLoading = false;
      }
    );

    builder.addMatcher(
      (action) => action.type === 'auth/signOutThunk/fulfilled',
      (state) => {
        state.is2FAEnabled = false;
        state.isAuthenticated = false;
        state.sid = '';
      }
    );
  },
});

export const auth = persistReducer(authPersistConfig, slice.reducer);
