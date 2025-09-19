import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import type { AppEnvPickerState } from '@/features/envPicker/model/types.ts';

const initialState: AppEnvPickerState = { env: import.meta.env.VITE_ENV };

const slice = createSlice({
  name: 'env',
  initialState,
  reducers: {
    setEnvName: (
      state: AppEnvPickerState,
      { payload }: PayloadAction<AppEnvPickerState['env']>
    ) => {
      state.env = payload;
    },
  },
});

export const {
  actions: { setEnvName },
  reducer: env,
} = slice;
