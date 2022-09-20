import { createStyles, MantineProvider } from '@mantine/core';
import { Outlet } from 'umi';

const withProvider = () => {
  const { classes } = useStyles();

  return (
    <MantineProvider withNormalizeCSS withGlobalStyles>
      <div className={classes.appWrapper}>
        <Outlet />
      </div>
    </MantineProvider>
  );
};

export default withProvider;

const useStyles = createStyles(() => ({
  appWrapper: {
    margin: '8px',
    paddingBottom: '70px',
  },
}));
