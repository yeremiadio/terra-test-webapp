import './index.css';

import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App.tsx';
import { SidebarProvider } from './components/ui/sidebar.tsx';
import { Provider } from 'react-redux';
import { setupStore } from './stores/index.ts';

const store = setupStore();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <SidebarProvider>
        <App />
      </SidebarProvider>
    </Provider>
  </React.StrictMode>,
);
