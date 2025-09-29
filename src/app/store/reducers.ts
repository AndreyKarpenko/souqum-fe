import { combineReducers } from '@reduxjs/toolkit';
import { user } from '@/entities/user/redux';
import { auth } from '@/entities/auth/redux';

export const reducers = combineReducers({
  user,
  auth,
});
