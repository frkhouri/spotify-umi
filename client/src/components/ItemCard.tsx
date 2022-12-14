import { ListItem } from '@/dtos';
import {
  ActionIcon,
  Card,
  createStyles,
  Group,
  Image,
  Skeleton,
  Text,
} from '@mantine/core';
import axios from 'axios';
import { PlayerPlay } from 'tabler-icons-react';

export const ItemCard = ({ item }: { item: ListItem }) => {
  const { classes, theme } = useStyles();
  const actionIconColor =
    theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 5 : 6];

  const playItem = async () => {
    await axios.get(
      `/type/${item.type === 'show' ? 'episode' : item.type}/id/${
        item.id
      }/play`,
    );
  };

  return (
    <Card withBorder shadow="xs" radius="md">
      <Card.Section withBorder>
        <Image src={item.image} height="235px" />
      </Card.Section>
      <Card.Section p="sm" className={classes.body}>
        <Text weight={500} size="sm" lineClamp={1}>
          {item.name}
        </Text>
        {item.description?.split('\n').map((text, i) => (
          <Text size="xs" lineClamp={2} key={i}>
            {text}
          </Text>
        ))}
      </Card.Section>
      <Card.Section withBorder>
        <Group align="center" position="apart" p="sm">
          <Text
            weight={700}
            size="xs"
            color="dimmed"
            lineClamp={1}
            className={classes.ownerText}
          >
            {item.owner?.name}
          </Text>
          <ActionIcon variant="outline" size={30} color={actionIconColor}>
            <PlayerPlay
              fill={actionIconColor}
              height={20}
              radius="md"
              color={actionIconColor}
              onClick={playItem}
            />
          </ActionIcon>
        </Group>
      </Card.Section>
    </Card>
  );
};

export const ItemCardSkeleton = () => {
  const { classes } = useStyles();

  return (
    <Card withBorder shadow="xs" radius="md">
      <Card.Section withBorder>
        <Skeleton height="235px" />
      </Card.Section>
      <Card.Section p="sm" className={classes.body}>
        <Skeleton height="22px" className={classes.skeletonText} />
        <Skeleton height="15px" className={classes.skeletonText} />
        <Skeleton height="15px" width="85%" className={classes.skeletonText} />
      </Card.Section>
      <Card.Section withBorder>
        <Group align="center" position="apart" p="sm">
          <Skeleton height="20px" width="60%" />
          <Skeleton height="30px" width="30px" />
        </Group>
      </Card.Section>
    </Card>
  );
};

const useStyles = createStyles(() => ({
  body: {
    marginTop: '-2px',
    height: '80px',
  },
  ownerText: {
    maxWidth: '75%',
  },
  skeletonText: {
    marginBottom: '2px',
  },
}));

export default ItemCard;
