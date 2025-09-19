import { reducers } from '@/app/store/reducers';
import { store } from '@/app/store';

export type CoreReduxState = ReturnType<typeof reducers>;
export type AppDispatch = typeof store.dispatch;

export type ThunkApiConfig<E = string> = {
  rejectValue: E;
  state: CoreReduxState;
  dispatch: AppDispatch;
};
