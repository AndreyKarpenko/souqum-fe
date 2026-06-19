import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import '../styles/index.css';

import { Router } from '@/app/routes';

import { store, persistedStore } from '@/app/store';
import { MainAppProvider } from '@/app/providers/MainAppProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistedStore}>
      <MainAppProvider>
        <Router />
      </MainAppProvider>
    </PersistGate>
  </Provider>
);
