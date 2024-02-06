// Every component page should have this dynamic import component
import { lazy } from 'react';

import Lazyload from '@/components/LazyLoad';

const GreetingLazy = lazy(() => import('@/pages/Greeting/GreetingPage'));

const GreetingPage = () => {
  return <Lazyload component={GreetingLazy} />;
};

export default GreetingPage;
