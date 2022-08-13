import { Avatar, Chip } from '@mantine/core';
import { SpotlightProvider } from '@mantine/spotlight';
import axios from 'axios';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Search } from 'tabler-icons-react';
import { Outlet } from 'umi';

function ActionsWrapper({
  children,
  types,
  setTypes,
}: {
  children: React.ReactNode;
  types: string[];
  setTypes: Dispatch<SetStateAction<string[]>>;
}) {
  return (
    <div>
      <Chip.Group position="center" multiple value={types} onChange={setTypes}>
        <Chip value="album">Albums</Chip>
        <Chip value="artist">Artists</Chip>
        <Chip value="playlist">Playlists</Chip>
        <Chip value="track">Tracks</Chip>
        <Chip value="show">Shows</Chip>
        <Chip value="episode">Episodes</Chip>
      </Chip.Group>
      {children}
    </div>
  );
}

const withSpotlight = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actions, setActions] = useState([]);
  const [types, setTypes] = useState(['album', 'artist', 'playlist']);

  useEffect(() => {
    const search = setTimeout(async () => {
      const results = searchTerm
        ? await axios
            .get('/search', {
              params: {
                ...(searchTerm && {
                  searchTerm: searchTerm,
                }),
                types,
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
  }, [searchTerm, types]);

  const onSearchChange = (e: React.FormEvent<HTMLDivElement>) => {
    console.log(e);
    if (!e.target.className.includes('Chip')) {
      setSearchTerm(e.target.value);
    }
  };

  return (
    <SpotlightProvider
      actions={actions}
      searchIcon={<Search size={18} />}
      searchPlaceholder="Search for anything"
      onChange={(e) => onSearchChange(e)}
      onSpotlightClose={() => setActions([])}
      actionsWrapperComponent={(e) =>
        ActionsWrapper({
          children: e.children,
          types: types,
          setTypes: setTypes,
        })
      }
    >
      <Outlet />
    </SpotlightProvider>
  );
};

export default withSpotlight;
