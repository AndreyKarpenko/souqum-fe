import { createAsyncThunk } from '@reduxjs/toolkit';
import { abortAllRequests, ejectAuthInterceptor } from '@/shared/api/apiClient';
import { signOutApi } from '@/features/auth/LogoutButton/api/logoutService.tsx';

export const signOutThunk = createAsyncThunk('auth/signOutThunk', async () => {
  await signOutApi();
  abortAllRequests();
  ejectAuthInterceptor();
});
