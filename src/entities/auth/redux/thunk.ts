import { AxiosError } from 'axios';

import { createAsyncThunk } from '@reduxjs/toolkit';
import { abortAllRequests, ejectAuthInterceptor } from '@/app/api/apiClient.tsx';
import { getMeApi, signInApi, verifyOtpApi } from '@/entities/auth/api/authService.tsx';
import { signOutApi } from '@/features/auth/LogoutButton/api/logoutService.tsx';

export const signInThunk = createAsyncThunk<
  { is2FAEnabled: boolean; sid?: string },
  { email: string; password: string }
>('auth/signInThunk', async (params, { rejectWithValue }) => {
  try {
    return await signInApi(params);
  } catch (e) {
    const error = e as AxiosError<{
      statusCode: number;
      message: string;
      timestamp: string;
      path: string;
    }>;
    return rejectWithValue(error.response?.data.message ?? 'Something went wrong');
  }
});

export const verifyOtpThunk = createAsyncThunk<void, { sid: string; otp: string }>(
  'auth/verifyOtpThunk',
  async (params, { rejectWithValue }) => {
    try {
      await verifyOtpApi(params);
    } catch (e) {
      const error = e as AxiosError<{
        statusCode: number;
        message: string;
        timestamp: string;
        path: string;
      }>;
      return rejectWithValue(error.response?.data.message ?? 'Something went wrong');
    }
  }
);

export const checkSessionThunk = createAsyncThunk(
  'auth/checkSession',
  async (_, { rejectWithValue }) => {
    try {
      return await getMeApi();
    } catch {
      return rejectWithValue(null);
    }
  }
);

export const signOutThunk = createAsyncThunk('auth/signOutThunk', async () => {
  await signOutApi();
  abortAllRequests();
  ejectAuthInterceptor();
});
