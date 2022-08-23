import { Button, createStyles, SimpleGrid } from '@mantine/core';
import { Alien, Flame, Microphone, Playlist } from 'tabler-icons-react';

export function HomeActions() {
  const { classes } = useStyles();

  const homeActions = [
    {
      text: 'My Playlists',
      icon: <Playlist />,
    },
    {
      text: 'My Shows',
      icon: <Microphone />,
    },
    {
      text: 'Featured',
      icon: <Flame />,
    },
    {
      text: 'Recommended',
      icon: <Alien />,
    },
  ];

  return (
    <SimpleGrid cols={2} spacing="sm">
      {homeActions.map((action) => (
        <Button
          rightIcon={action.icon}
          variant="default"
          classNames={{ inner: classes.button }}
          key={action.text}
        >
          {action.text}
        </Button>
      ))}
    </SimpleGrid>
  );
}

const useStyles = createStyles((theme) => ({
  button: {
    justifyContent: 'space-between',
  },
}));
