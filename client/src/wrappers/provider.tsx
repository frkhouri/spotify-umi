import { MantineProvider } from '@mantine/core';
import { Outlet } from 'umi';

const withProvider = () => {
  return (
    <MantineProvider withNormalizeCSS withGlobalStyles>
      <div style={{ margin: '8px' }}>
        <Outlet />
      </div>
    </MantineProvider>
  );
};

export default withProvider;
