import { SplitButton } from '@/components';
import { createStyles } from '@mantine/core';
import axios from 'axios';
import {
  Armchair2,
  Bolt,
  CloudStorm,
  Dice5,
  MoodHappy,
} from 'tabler-icons-react';

const useStyles = createStyles(() => ({}));

export default function HomePage() {
  const { theme } = useStyles();
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
      <SplitButton
        text={"I'm Feeling Lucky"}
        fullWidth={true}
        variant={'gradient'}
        gradient={{ from: 'indigo', to: 'cyan' }}
        leftIcon={<Dice5 />}
        onClick={() => handleClick()}
        menuItems={menuItems}
      />
    </>
  );
}
