import { Playlist } from '@/dtos';
import {
  ActionIcon,
  Card,
  createStyles,
  Group,
  Image,
  Text,
} from '@mantine/core';
import { PlayerPlay } from 'tabler-icons-react';

export const HorizontalList = ({ item }: { item: Playlist }) => {
  const { classes, theme } = useStyles();
  const actionIconColor =
    theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 5 : 6];

  return (
    <Card withBorder shadow="xs" radius="md">
      <Card.Section withBorder>
        <Image src={item.image} height="235px" />
      </Card.Section>
      <Card.Section p="sm" className={classes.body}>
        <Text weight={500} size="sm" lineClamp={1}>
          {item.name}
        </Text>
        <Text size="xs" lineClamp={2}>
          {item.description}
        </Text>
      </Card.Section>
      <Card.Section withBorder>
        <Group align="center" position="apart" p="sm">
          <Text weight={700} size="xs" color="dimmed">
            {item.owner.name}
          </Text>
          <ActionIcon variant="outline" size={30} color={actionIconColor}>
            <PlayerPlay
              fill={actionIconColor}
              height={20}
              radius="md"
              color={actionIconColor}
            />
          </ActionIcon>
        </Group>
      </Card.Section>
    </Card>
  );
};

const useStyles = createStyles(() => ({
  body: {
    marginTop: '-2px',
    height: '59px',
  },
}));

export default HorizontalList;
