import { HomeActions, SplitButton } from '@/components';
import HorizontalList from '@/components/HorizontalList';
import { createStyles, Stack } from '@mantine/core';
import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  Armchair2,
  Bolt,
  CloudStorm,
  Dice5,
  MoodHappy,
} from 'tabler-icons-react';

export default function HomePage() {
  const { theme } = useStyles();
  const [data, setData] = useState({});
  const minThreshold = 0.8;
  const maxThreshold = 0.2;
  const menuIconColor =
    theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 5 : 6];

  const handleClick = async (attribute?: string, threshold?: number) => {
    await axios.get('/im-feeling-lucky', {
      params: {
        ...(attribute && {
          [attribute]: threshold,
        }),
      },
    });
  };

  useEffect(() => {
    const getHomeData = async () => {
      const res = await axios.get('/home');

      setData(res.data);
    };

    getHomeData().catch((e) => console.log(e));
  }, []);

  const menuItems = [
    {
      text: 'Energetic',
      icon: <Bolt color={menuIconColor} />,
      onClick: () => handleClick('min_energy', minThreshold),
    },
    {
      text: 'Chill',
      icon: <Armchair2 color={menuIconColor} />,
      onClick: () => handleClick('max_energy', maxThreshold),
    },
    {
      text: 'Happy',
      icon: <MoodHappy color={menuIconColor} />,
      onClick: () => handleClick('min_valence', minThreshold),
    },
    {
      text: 'Moody',
      icon: <CloudStorm color={menuIconColor} />,
      onClick: () => handleClick('max_valence', maxThreshold),
    },
  ];

  return (
    <>
      <Stack spacing="sm">
        <SplitButton
          text={"I'm Feeling Lucky"}
          fullWidth={true}
          variant={'gradient'}
          gradient={{ from: 'indigo', to: 'cyan' }}
          leftIcon={<Dice5 />}
          onClick={() => handleClick()}
          menuItems={menuItems}
        />
        <HomeActions />
        {data.lists &&
          data.lists.map((list) => (
            <HorizontalList
              heading={list.name}
              type="playlists"
              items={list.items}
            />
          ))}
      </Stack>
    </>
  );
}

const useStyles = createStyles(() => ({}));
