import { Playlist } from '@/dtos';
import { Carousel } from '@mantine/carousel';
import {
  ActionIcon,
  Card,
  createStyles,
  Group,
  Image,
  Text,
} from '@mantine/core';
import { DotsVertical } from 'tabler-icons-react';

export type HorizontalListProps = {
  heading?: string;
  type: 'tracks' | 'shows' | 'playlists';
  items: Playlist[];
};

export const HorizontalList = ({
  heading,
  type,
  items,
}: HorizontalListProps) => {
  const { classes } = useStyles();

  return (
    <>
      <Card
        shadow="sm"
        p="lg"
        radius="md"
        withBorder
        className={classes.containerCard}
      >
        <Card.Section withBorder className={classes.containerHeader}>
          <Group position="apart">
            {/* <Group>
            <Avatar src={friend.user.image} radius="xl" size="md" /> */}
            <Text weight={500}>{heading}</Text>
            {/* </Group> */}
            <ActionIcon variant="default">
              <DotsVertical height={16} />
            </ActionIcon>
          </Group>
        </Card.Section>
        <Card.Section className={classes.containerBody}></Card.Section>
      </Card>
      <Carousel
        slideSize="70%"
        // height={200}
        slideGap="md"
        dragFree
        withControls={false}
        align="start"
        classNames={{ root: classes.carouselRoot }}
      >
        {items?.length &&
          items.map((item) => (
            <Carousel.Slide>
              <Card withBorder style={{ margin: '0px -5px' }}>
                <Card.Section>
                  <Image src={item.image} />
                </Card.Section>
                <Card.Section>
                  <Text>{item.name}</Text>
                </Card.Section>
              </Card>
            </Carousel.Slide>
          ))}
      </Carousel>
    </>
  );
};

const useStyles = createStyles((theme) => ({
  carouselRoot: {
    margin: '0px -8px -330px 0px',
    padding: '0px 25px',
    top: '-330px',
  },
  containerCard: {
    margin: '10px 0px',
    // overflow: 'visible',
  },
  containerHeader: {
    padding: '10px 15px',
  },
  containerBody: {
    padding: '15px',
    height: '300px',
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

export default HorizontalList;
