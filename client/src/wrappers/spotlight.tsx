import { Avatar, Chip } from '@mantine/core';
import { SpotlightProvider } from '@mantine/spotlight';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Search } from 'tabler-icons-react';
import { Outlet } from 'umi';

function ActionsWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Chip.Group position="center" multiple>
        <Chip value="1">Single chip</Chip>
        <Chip value="2">Can be selected</Chip>
        <Chip value="3">At a time</Chip>
      </Chip.Group>

      {children}
    </div>
  );
}

const withSpotlight = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actions, setActions] = useState([]);

  useEffect(() => {
    const search = setTimeout(async () => {
      const results = searchTerm
        ? await axios
            .get('/search', {
              params: {
                ...(searchTerm && {
                  searchTerm: searchTerm,
                }),
                types: [
                  // 'album',
                  'artist',
                  // 'playlist',
                  // 'track',
                  // 'show',
                  // 'episode',
                ],
              },
            })
            .then((res) => res.data)
        : [];
      console.log(results);
      results.artists &&
        setActions(
          results?.artists?.map((result) => {
            return {
              title: result.name,
              onTrigger: () => console.log(result.name),
              icon: <Avatar src={result.image} />,
            };
          }),
        );
      console.log(actions);
    }, 750);

    return () => clearTimeout(search);
  }, [searchTerm]);

  return (
    <SpotlightProvider
      actions={actions}
      searchIcon={<Search size={18} />}
      searchPlaceholder="Search for anything"
      onChange={(e) => setSearchTerm(e.target.value)}
      onSpotlightClose={() => setActions([])}
      actionsWrapperComponent={ActionsWrapper}
    >
      <Outlet />
    </SpotlightProvider>
  );
};

export default withSpotlight;
