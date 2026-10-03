import { useDispatch } from 'react-redux';
import type { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';

export const useThunkDispatch = () =>
  useDispatch<ThunkDispatch<unknown, unknown, UnknownAction>>();
