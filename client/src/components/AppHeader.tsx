import { ActionIcon, createStyles, Group, Header, Text } from '@mantine/core';
import { DotsVertical } from 'tabler-icons-react';
import { useLocation } from 'umi';

export function AppHeader() {
  const location = useLocation();
  const { classes } = useStyles();
  console.log(location);
  return (
    <Header height={50} withBorder classNames={{ root: classes.root }}>
      <Group align="center" position="apart">
        <Text size="xl" weight={500} transform="capitalize" p="xs" inline>
          {location.state?.pageTitle ?? location.pathname.split('/')[1]}
        </Text>
        <ActionIcon variant="default">
          <DotsVertical height={16} />
        </ActionIcon>
      </Group>
    </Header>
  );
}

const useStyles = createStyles((theme) => ({
  root: {
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    margin: '0px -10px 15px -10px',
    padding: '0px 15px',
    top: '0px',
  },
}));
