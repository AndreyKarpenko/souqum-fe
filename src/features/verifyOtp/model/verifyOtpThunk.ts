import { AxiosError } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { verifyOtpApi } from '@/features/verifyOtp/api/verifyOtpApi.ts';

export const verifyOtpThunk = createAsyncThunk<void, { sid: string; otp: string }>(
  'auth/verifyOtpThunk',
  async (params, { rejectWithValue }) => {
    try {
      await verifyOtpApi(params);
    } catch (e) {
      const error = e as AxiosError<{ message: string }>;
      return rejectWithValue(error.response?.data.message ?? 'Something went wrong');
    }
  }
);
