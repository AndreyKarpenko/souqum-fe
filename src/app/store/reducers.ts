import { combineReducers } from '@reduxjs/toolkit';
import { env } from '@/features/envPicker/redux';

export const reducers = combineReducers({
  env,
});
