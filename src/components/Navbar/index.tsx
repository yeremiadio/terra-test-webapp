import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { useLocation } from 'react-router-dom';
import TimeDisplay from './_components/TimeDisplay';

const Navbar = () => {
  const { isMobile } = useSidebar();
  const location = useLocation();
  const currentLocationName = location.pathname.split('/')[1]
    ? location.pathname.split('/')[1].charAt(0).toUpperCase() +
      location.pathname.split('/')[1].slice(1)
    : 'Dashboard';
  return (
    <header className="bg-background sticky top-0 z-50 w-full border-b border-border">
      <div className="container-nav 3xl:fixed:px-0 py-2 lg:py-4 flex">
        {isMobile && <SidebarTrigger />}
        <div className="flex items-center gap-4">
          <h1 className="font-bold ml-2 md:ml-0 text-lg md:text-2xl">
            {currentLocationName}
          </h1>
          {!isMobile && <TimeDisplay />}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
