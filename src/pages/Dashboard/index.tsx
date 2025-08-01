import { lazy } from 'react';

import Lazyload from '@/components/LazyLoad';

const DashboardLazy = lazy(() => import('@/pages/Dashboard/DashboardPage'));

const DashboardPage = () => {
  return <Lazyload component={DashboardLazy} />;
};

export default DashboardPage;
