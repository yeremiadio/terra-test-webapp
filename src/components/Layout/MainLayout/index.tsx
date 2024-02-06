import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="flex justify-center h-screen flex-col items-center">
      <Outlet />
    </div>
  );
};

export default MainLayout;
