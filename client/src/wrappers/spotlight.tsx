import { SpotlightProvider } from '@mantine/spotlight';
import { Outlet } from 'umi';

const withSpotlight = () => {
  return (
    <SpotlightProvider actions={[]}>
      <Outlet />
    </SpotlightProvider>
  );
};

export default withSpotlight;
