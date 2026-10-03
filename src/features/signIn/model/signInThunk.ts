import { AxiosError } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { signInApi } from '@/features/signIn/api/signInApi.ts';

export const signInThunk = createAsyncThunk<
  { is2FAEnabled: boolean; sid?: string },
  { email: string; password: string }
>('auth/signInThunk', async (params, { rejectWithValue }) => {
  try {
    return await signInApi(params);
  } catch (e) {
    const error = e as AxiosError<{ message: string }>;
    return rejectWithValue(error.response?.data.message ?? 'Something went wrong');
  }
});
