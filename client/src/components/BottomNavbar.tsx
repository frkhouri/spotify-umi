import { ActionIcon, createStyles, Navbar } from '@mantine/core';
import { useState } from 'react';
import { Home, Search, User, Users } from 'tabler-icons-react';
import { history, useLocation } from 'umi';

const data = [
  {
    value: 'home',
    icon: Home,
  },
  {
    value: 'discover',
    icon: Search,
  },
  {
    value: 'friends',
    icon: Users,
  },
  {
    value: 'me',
    icon: User,
  },
];

export const BottomNavbar = () => {
  const [active, setActive] = useState(
    useLocation().pathname.substring(1) || 'home',
  );
  const { classes, theme } = useStyles();

  const handleClick = (page: string) => {
    history.replace(page);
    setActive(page);
  };

  const links = data.map((item) => (
    <ActionIcon
      size={40}
      onClick={() => handleClick(item.value)}
      key={item.value}
    >
      <item.icon
        strokeWidth={active === item.value ? 3 : 2.5}
        color={
          active === item.value
            ? theme.colors[theme.primaryColor][
                theme.colorScheme === 'dark' ? 5 : 6
              ]
            : theme.colors.gray[6]
        }
      />
    </ActionIcon>
  ));

  return (
    <Navbar height="65px" width={{ sm: '100%' }} className={classes.navbar}>
      <Navbar.Section p="sm" className={classes.navbarSection}>
        {links}
      </Navbar.Section>
    </Navbar>
  );
};

const useStyles = createStyles(() => ({
  navbar: {
    justifyContent: 'center',
    borderTop: '1px solid #dee2e6',
  },
  navbarSection: {
    display: 'flex',
    justifyContent: 'space-around',
  },
}));
