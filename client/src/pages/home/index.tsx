import { HomeActions, SplitButton } from '@/components';
import HorizontalList, {
  HorizontalListSkeleton,
} from '@/components/HorizontalList';
import { List } from '@/dtos';
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
  const [homeData, setHomeData] = useState<{ lists: List[] }>({ lists: [] });
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

  const setItems = async (updatedList: List) => {
    const updatedHomeData = { ...homeData };
    const listIndex = updatedHomeData.lists.findIndex(
      (list) => list._id === updatedList._id,
    );

    const returnedList = await axios
      .patch(`/lists/${updatedList._id}`, {
        name: updatedList.name,
        items: updatedList.items,
      })
      .then((res) => res.data);

    updatedHomeData.lists[listIndex] = returnedList;
    setHomeData(updatedHomeData);
  };

  useEffect(() => {
    const getHomeData = async () => {
      const data = await axios
        .get('/home')
        .then((res) => res.data)
        .catch((e) => console.log(e));
      setHomeData(data ?? { lists: [] });
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
        {homeData.lists?.length
          ? homeData.lists.map((list) => (
              <HorizontalList list={list} setItems={setItems} key={list._id} />
            ))
          : [1, 2].map((_e, i) => <HorizontalListSkeleton key={i} />)}
      </Stack>
    </>
  );
}

const useStyles = createStyles(() => ({}));
