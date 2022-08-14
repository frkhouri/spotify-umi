import { Friend } from '@/dtos';
import { Avatar, Card, Grid, Group, Image, Text } from '@mantine/core';

export const FriendCard = ({ friend }: { friend: Friend }) => {
  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Card.Section withBorder>
        <Group>
          <Avatar src={friend.user.image} radius="xl" size="lg" />
          <Text weight={500}>{friend.user.name}</Text>
        </Group>
      </Card.Section>
      <Grid>
        <Grid.Col span={4}>
          <Image src={friend.track.image} withPlaceholder radius="md" />
        </Grid.Col>
        <Grid.Col span={8}>
          <Text>{friend.track.name}</Text>
          <Text>{friend.context.name}</Text>
        </Grid.Col>
      </Grid>
    </Card>
  );
};

export default FriendCard;
