import { HorizontalListProps, List } from '@/dtos';
import { Carousel } from '@mantine/carousel';
import {
  ActionIcon,
  Card,
  createStyles,
  Group,
  Menu,
  Skeleton,
  Text,
} from '@mantine/core';
import { useState } from 'react';
import { DotsVertical, Edit } from 'tabler-icons-react';
import EditListModal from './EditListModal';
import { ItemCard, ItemCardSkeleton } from './ItemCard';

export const HorizontalList = ({ list, setItems }: HorizontalListProps) => {
  const { classes } = useStyles();
  const [editModalOpen, setEditModalOpen] = useState(false);

  const menuItems = [
    {
      text: 'Edit',
      icon: <Edit />,
      onClick: () => setEditModalOpen(true),
    },
    // {
    //   text: 'Hide',
    //   icon: <EyeOff />,
    //   onClick: () => handleClick('max_energy', maxThreshold),
    // },
  ];

  const onEditModalClose = () => {
    setEditModalOpen(false);
  };

  const onEditModalSubmit = async (updatedList: List) => {
    await setItems(updatedList).then(() => setEditModalOpen(false));
  };

  return (
    <>
      <Card p="lg" radius="md" withBorder>
        <Card.Section withBorder className={classes.containerHeader}>
          <Group position="apart">
            <Text weight={500}>{list.name}</Text>
            <EditListModal
              opened={editModalOpen}
              onClose={onEditModalClose}
              onSubmit={onEditModalSubmit}
              list={list}
            />
            <Menu transition="pop" position="bottom-end">
              <Menu.Target>
                <ActionIcon variant="default">
                  <DotsVertical height={16} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                {menuItems.map((item, i) => (
                  <Menu.Item icon={item.icon} onClick={item.onClick} key={i}>
                    {item.text}
                  </Menu.Item>
                ))}
              </Menu.Dropdown>
            </Menu>
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
        {list.items.map((item) => (
          <Carousel.Slide className={classes.slide} key={item.id}>
            <ItemCard item={item} />
          </Carousel.Slide>
        ))}
      </Carousel>
    </>
  );
};

export const HorizontalListSkeleton = () => {
  const { classes } = useStyles();

  return (
    <>
      <Card p="lg" radius="md" withBorder>
        <Card.Section withBorder className={classes.containerHeader}>
          <Group position="apart">
            <Skeleton height="25px" width="60%" />
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
        {[1, 2, 3, 4].map((item) => (
          <Carousel.Slide className={classes.slide} key={item}>
            <ItemCardSkeleton item={item} />
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
    height: '405px',
  },
  slide: {
    minWidth: '235px',
  },
}));

export default HorizontalList;
