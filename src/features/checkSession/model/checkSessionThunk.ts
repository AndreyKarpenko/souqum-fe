import { createAsyncThunk } from '@reduxjs/toolkit';
import { getMyProfileApi } from '@/entities/user';

export const checkSessionThunk = createAsyncThunk('auth/checkSession', async (_, { rejectWithValue }) => {
  try {
    return await getMyProfileApi();
  } catch {
    return rejectWithValue(null);
  }
});
