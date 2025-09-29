import { AxiosError } from 'axios';

import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  abortAllRequests,
  applyAuthInterceptor,
  ejectAuthInterceptor,
} from '@/app/api/apiClient.tsx';
import { refreshTokenApi, signInApi } from '@/entities/auth/api/authService.tsx';
import { signOutApi } from '@/features/auth/LogoutButton/api/logoutService.tsx';

export const signInThunk = createAsyncThunk<string, any>(
  'auth/signInThunk',
  async (params, { rejectWithValue, dispatch }) => {
    try {
      const dispatchLogoutThunk = () => {
        void dispatch(signOutThunk());
      };
      const dispatchRefreshTokenThunk = () => {
        void dispatch(refreshTokenThunk());
      };
      const { accessToken } = await signInApi(params);
      applyAuthInterceptor(accessToken, dispatchLogoutThunk, dispatchRefreshTokenThunk);
      return accessToken;
    } catch (e) {
      const error = e as AxiosError<any>;
      return rejectWithValue(error.response?.data.detail ?? 'Something went wrong');
    }
  }
);

export const refreshTokenThunk = createAsyncThunk<string, void>(
  'auth/refreshTokenThunk',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const dispatchLogoutThunk = () => {
        void dispatch(signOutThunk());
      };
      const dispatchRefreshTokenThunk = () => {
        void dispatch(refreshTokenThunk());
      };
      const { accessToken } = await refreshTokenApi();
      ejectAuthInterceptor();
      applyAuthInterceptor(accessToken, dispatchLogoutThunk, dispatchRefreshTokenThunk);
      return accessToken;
    } catch (e) {
      const error = e as AxiosError<any>;
      return rejectWithValue(error.response?.data.detail ?? 'Something went wrong');
    }
  }
);

export const signOutThunk = createAsyncThunk('auth/signOutThunk', async () => {
  await signOutApi();
  abortAllRequests();
  ejectAuthInterceptor();
});
