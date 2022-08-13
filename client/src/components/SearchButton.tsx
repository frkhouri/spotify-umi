import { Button, createStyles } from '@mantine/core';
import { useSpotlight } from '@mantine/spotlight';
import { Search } from 'tabler-icons-react';

export function SearchButton() {
  const spotlight = useSpotlight();
  const { classes } = useStyles();

  return (
    <Button
      leftIcon={<Search size={16} />}
      variant="default"
      onClick={spotlight.openSpotlight}
      fullWidth
      classNames={{ inner: classes.button }}
    >
      Search
    </Button>
  );
}

const useStyles = createStyles((theme) => ({
  button: {
    justifyContent: 'flex-start',
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[2]
        : theme.colors.gray[6],
  },
}));
