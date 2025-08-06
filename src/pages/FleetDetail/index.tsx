import { lazy } from 'react';

import Lazyload from '@/components/LazyLoad';

const FleetDetailLazy = lazy(
  () => import('@/pages/FleetDetail/FleetDetailPage'),
);

const FleetDetailPage = () => {
  return <Lazyload component={FleetDetailLazy} />;
};

export default FleetDetailPage;
