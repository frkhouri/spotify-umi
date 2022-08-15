import { Friend } from '@/dtos';
import {
  Avatar,
  Card,
  createStyles,
  Grid,
  Group,
  Image,
  Text,
} from '@mantine/core';
import { Disc, Playlist, User, Volume } from 'tabler-icons-react';

export const FriendCard = ({ friend }: { friend: Friend }) => {
  const { classes } = useStyles();

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder className={classes.card}>
      <Card.Section withBorder className={classes.header}>
        <Group position="apart">
          <Group>
            <Avatar src={friend.user.image} radius="xl" size="md" />
            <Text weight={500}>{friend.user.name}</Text>
          </Group>
          <Text>{friend.time === 'online' ? <Volume /> : friend.time}</Text>
        </Group>
      </Card.Section>
      <Card.Section className={classes.body}>
        <Grid gutter="lg">
          <Grid.Col span={4}>
            <Image
              src={friend.track.image}
              withPlaceholder
              radius="md"
              classNames={{ image: classes.image }}
            />
          </Grid.Col>
          <Grid.Col span={8}>
            <Group spacing={0} className={classes.details}>
              <Text lineClamp={1}>
                {friend.track.name} • {friend.track.artist.name}
              </Text>
              <Group spacing={6}>
                {friend.context.type === 'playlist' ? (
                  <Playlist />
                ) : friend.context.type === 'artist' ? (
                  <User />
                ) : (
                  <Disc />
                )}
                <Text weight={500}>{friend.context.name}</Text>
              </Group>
            </Group>
          </Grid.Col>
        </Grid>
      </Card.Section>
    </Card>
  );
};

const useStyles = createStyles((theme) => ({
  card: {
    margin: '10px 0px',
  },
  header: {
    padding: '10px 15px',
  },
  body: {
    padding: '15px',
  },
  image: {
    borderStyle: 'dotted',
    borderWidth: 'thin',
    borderColor:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[2]
        : theme.colors.gray[6],
  },
  details: {
    height: '100%',
    alignContent: 'space-evenly',
  },
}));

export default FriendCard;
