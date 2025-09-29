import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { reducers } from './reducers';

type CoreReduxState = ReturnType<typeof reducers>;

const whitelist: Extract<keyof CoreReduxState, string>[] = ['user'];

const persistConfig = {
  key: 'root',
  whitelist,
  storage,
};

export const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
});

export const persistedStore = persistStore(store);
