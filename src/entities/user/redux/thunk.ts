import { AxiosError } from 'axios';

import { createAsyncThunk } from '@reduxjs/toolkit';

import { getMyProfileApi } from '@/entities/user/api/userService.tsx';
import type { User } from '@/entities/user/model/types.ts';

export const getMyProfileThunk = createAsyncThunk<User, void>(
  'auth/getMyProfileThunk',
  async (_, { rejectWithValue }) => {
    try {
      return await getMyProfileApi();
    } catch (e) {
      const error = e as AxiosError<any>;
      return rejectWithValue(error.response?.data.detail ?? 'Something went wrong');
    }
  }
);
