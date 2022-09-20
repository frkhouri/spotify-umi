import { AppHeader, BottomNavbar } from '@/components';
import { Affix } from '@mantine/core';
import { Outlet } from 'umi';

const Layout = () => {
  return (
    <div>
      <AppHeader />
      <Outlet />
      <Affix position={{ bottom: -2, left: 0, right: 0 }}>
        <BottomNavbar />
      </Affix>
    </div>
  );
};

export default Layout;
