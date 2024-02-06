import { Route, Routes, BrowserRouter } from 'react-router-dom';

import GreetingPage from '@/pages/Greeting';
import ErrorPage from '@/pages/Error';

import MainLayout from '@/components/Layout/MainLayout';

import { ROUTES } from '@/utils/configs/routes';

import './App.css';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route
              path={ROUTES.base}
              element={<GreetingPage />}
              errorElement={<ErrorPage />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
