import { SegmentedControl } from '@mantine/core';
import { Home, Search, User, Users } from 'tabler-icons-react';
import { history } from 'umi';

export function Navbar() {
  return (
    <SegmentedControl
      fullWidth
      size="md"
      onChange={(value) => history.replace(value)}
      data={[
        {
          value: 'home',
          label: <Home />,
        },
        {
          value: 'discover',
          label: <Search />,
        },
        {
          value: 'friends',
          label: <Users />,
        },
        {
          value: 'me',
          label: <User />,
        },
      ]}
    />
  );
}
