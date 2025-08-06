import { lazy } from 'react';

import Lazyload from '@/components/LazyLoad';

const FleetLazy = lazy(() => import('@/pages/Fleet/FleetPage'));

const FleetPage = () => {
  return <Lazyload component={FleetLazy} />;
};

export default FleetPage;
