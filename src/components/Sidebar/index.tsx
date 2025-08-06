import { terraIcon } from '@/assets';
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { ROUTES } from '@/utils/configs/routes';
import { FaTruckMoving } from 'react-icons/fa';
import {
  MdFirstPage,
  MdPropaneTank,
  MdSyncLock,
  MdDashboard,
} from 'react-icons/md';
import { Link, useLocation } from 'react-router-dom';

const items = [
  {
    title: 'Dashboard',
    url: '/',
    icon: MdDashboard,
  },
  {
    title: 'Fleets',
    url: ROUTES.fleet,
    icon: FaTruckMoving,
  },
  {
    title: 'Fuel History',
    url: ROUTES.fuelHistory,
    icon: MdPropaneTank,
  },
  {
    title: 'Reminders',
    url: ROUTES.reminders,
    icon: MdSyncLock,
  },
  {
    title: 'Reports',
    url: ROUTES.reports,
    icon: MdFirstPage,
  },
];

export function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  return (
    <ShadcnSidebar variant="sidebar">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <div className="flex gap-2 items-center justify-center py-6">
                <img src={terraIcon} alt="Terra Fleet" className="w-10 h-10" />
                <h3 className="font-bold text-lg">TeraFleet</h3>
              </div>
              {items.map(({ title, icon: Icon, url }) => (
                <SidebarMenuItem key={title} className="my-[2px]">
                  <SidebarMenuButton
                    size={'lg'}
                    asChild
                    isActive={
                      currentPath === url ||
                      (currentPath.startsWith(url + '/') && url !== '/')
                    }
                  >
                    <Link to={url} className="flex items-center gap-4">
                      <Icon size={20} />
                      <span className="text-[16px]">{title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </ShadcnSidebar>
  );
}
