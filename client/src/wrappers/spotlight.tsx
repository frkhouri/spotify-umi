import { ActionsWrapper } from '@/components';
import { SearchResult } from '@/dtos';
import { Avatar, createStyles } from '@mantine/core';
import { SpotlightProvider } from '@mantine/spotlight';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Search } from 'tabler-icons-react';
import { history, Outlet } from 'umi';

const withSpotlight = () => {
  const { classes } = useStyles();
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
                  searchTerm,
                }),
                types,
              },
            })
            .then((res) => res.data)
        : [];

      results &&
        setActions(
          results?.map((result: SearchResult) => {
            return {
              title: result.name,
              onTrigger: () => history.push(`${result.type}/${result.id}`),
              icon: <Avatar src={result.image} />,
              group: `${result.type}s`,
            };
          }),
        );
    }, 750);

    return () => clearTimeout(search);
  }, [searchTerm, types]);

  const onSearchChange = (e: React.FormEvent<HTMLDivElement>) => {
    if (!(e.target as HTMLInputElement).className.includes('Chip')) {
      setSearchTerm((e.target as HTMLInputElement).value);
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
      classNames={{ actions: classes.actions }}
    >
      <Outlet />
    </SpotlightProvider>
  );
};

export default withSpotlight;

const useStyles = createStyles(() => ({
  actions: {
    overflow: 'auto',
    maxHeight: '400px',
  },
}));
