import { Navbar } from '@/components';
import { Affix } from '@mantine/core';
import { Outlet } from 'umi';

const Layout = () => {
  return (
    <div>
      <Outlet />
      <Affix position={{ bottom: 0, left: 0, right: 0 }}>
        <Navbar />
      </Affix>
    </div>
  );
};

export default Layout;
