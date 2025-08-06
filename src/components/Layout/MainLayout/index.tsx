import Navbar from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <>
      <Sidebar />
      <div className="w-full relative z-10 flex min-h-svh flex-col">
        <Navbar />
        <main>
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default MainLayout;
