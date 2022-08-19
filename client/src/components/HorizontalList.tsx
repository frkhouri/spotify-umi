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
import { DotsVertical, PlayerPlay } from 'tabler-icons-react';

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
              <Card withBorder shadow="xs" radius="md">
                <Card.Section withBorder>
                  <Image src={item.image} height="235px" />
                </Card.Section>
                <Card.Section p="sm" className={classes.slideBody}>
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
                    <ActionIcon
                      variant="outline"
                      size={30}
                      color={actionIconColor}
                    >
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
    top: '-405px',
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
  image: {
    borderStyle: 'dotted',
    borderWidth: 'thin',
    borderColor:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[2]
        : theme.colors.gray[6],
  },
  slideBody: {
    marginTop: '-2px',
    height: '59px',
  },
  slideFooter: {
    padding: '10px',
  },
  title: {
    maxWidth: '70%',
  },
  details: {
    height: '100%',
    alignContent: 'space-evenly',
  },
}));

export default HorizontalList;
