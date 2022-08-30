import { Playlist } from '@/dtos';
import { Carousel } from '@mantine/carousel';
import { ActionIcon, Card, createStyles, Group, Text } from '@mantine/core';
import { DotsVertical } from 'tabler-icons-react';
import ItemCard from './ItemCard';

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
  const { classes, theme } = useStyles();
  const actionIconColor =
    theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 5 : 6];

  return (
    <>
      <Card p="lg" radius="md" withBorder>
        <Card.Section withBorder className={classes.containerHeader}>
          <Group position="apart">
            <Text weight={500}>{heading}</Text>
            <ActionIcon variant="default">
              <DotsVertical height={16} />
            </ActionIcon>
          </Group>
        </Card.Section>
        <Card.Section className={classes.containerBody}></Card.Section>
      </Card>
      <Carousel
        slideSize="70%"
        slideGap="md"
        dragFree
        withControls={false}
        align="start"
        classNames={{ root: classes.carouselRoot }}
      >
        {items?.length &&
          items.map((item) => (
            <Carousel.Slide className={classes.slide}>
              <ItemCard item={item} />
            </Carousel.Slide>
          ))}
      </Carousel>
    </>
  );
};

const useStyles = createStyles((theme) => ({
  carouselRoot: {
    margin: '0px -8px -330px -8px',
    padding: '0px 23px',
    top: '-375px',
    height: '400px',
  },
  containerHeader: {
    padding: '10px 15px',
  },
  containerBody: {
    padding: '15px',
    height: '375px',
  },
  slide: {
    minWidth: '235px',
  },
}));

export default HorizontalList;
