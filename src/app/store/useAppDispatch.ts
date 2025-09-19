import { useDispatch } from 'react-redux';

import type { AppDispatch } from '@/app/model/types.ts';

export const useAppDispatch: () => AppDispatch = useDispatch;
