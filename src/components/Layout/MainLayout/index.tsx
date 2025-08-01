import { Sidebar } from '@/components/Sidebar';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { Outlet, useLocation } from 'react-router-dom';

const MainLayout = () => {
  const { isMobile } = useSidebar();
  const location = useLocation();
  const currentLocationName = location.pathname.split('/')[1]
    ? location.pathname.split('/')[1].charAt(0).toUpperCase() +
      location.pathname.split('/')[1].slice(1)
    : 'Dashboard';
  return (
    <>
      <Sidebar />
      <div className="w-full relative z-10 flex min-h-svh flex-col">
        <header className="bg-background sticky top-0 z-50 w-full border-b border-border">
          <div className="container-nav 3xl:fixed:px-0 py-2 lg:py-4 flex">
            {isMobile && <SidebarTrigger />}
            <h1 className="font-bold ml-2 md:ml-0 text-lg md:text-2xl">
              {currentLocationName}
            </h1>
          </div>
        </header>
        <main className="p-2 lg:p-4">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default MainLayout;
