import { combineReducers } from '@reduxjs/toolkit';
import { user } from '@/entities/user';
import { auth } from '@/entities/auth';

export const reducers = combineReducers({
  user,
  auth,
});
