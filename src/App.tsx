import { Route, Routes, BrowserRouter } from 'react-router-dom';

import ErrorPage from '@/pages/Error';

import MainLayout from '@/components/Layout/MainLayout';

import { ROUTES } from '@/utils/configs/routes';

import './App.css';
import DashboardPage from './pages/Dashboard';

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route
              path={ROUTES.base}
              element={<DashboardPage />}
              errorElement={<ErrorPage />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
