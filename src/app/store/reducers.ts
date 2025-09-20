import { combineReducers } from '@reduxjs/toolkit';
import { env } from '@/features/envPicker/redux';
import { user } from '@/entities/user/redux';

export const reducers = combineReducers({
  env,
  user,
});
