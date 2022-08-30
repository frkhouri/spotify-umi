import { SearchResult } from '@/dtos';
import { Autocomplete, Avatar, createStyles, Group, Text } from '@mantine/core';
import axios from 'axios';
import { forwardRef, useEffect, useState } from 'react';
import { Search } from 'tabler-icons-react';
import { history } from 'umi';

const SearchResultItem = forwardRef<HTMLDivElement, SearchResult>(
  ({ name, image, ...others }: SearchResult, ref) => (
    <div ref={ref} style={{ width: '95%', margin: '-6px' }} {...others}>
      <Group noWrap>
        <Avatar src={image} />

        <div>
          <Text>{name}</Text>
        </div>
      </Group>
    </div>
  ),
);

export const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState([]);
  const [types, setTypes] = useState(['album', 'artist', 'playlist']);
  const { classes } = useStyles();

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
            .catch((e) => console.log(e))
        : [];

      results &&
        setData(
          results?.map(
            (result: SearchResult) => ({
              ...result,
              value: result.name,
              group: `${result.type}s`.toUpperCase(),
            }),
            // return {
            //   title: result.name,
            //   onTrigger: () => history.push(`${result.type}/${result.id}`),
            //   icon: <Avatar src={result.image} />,
            //   group: `${result.type}s`,
            // };
          ),
        );
    }, 750);

    return () => clearTimeout(search);
  }, [searchTerm]);

  const onSearchChange = (value: string) => {
    // if (!(value).className.includes('Chip')) {
    setSearchTerm(value);
    console.log('change');
    // }
  };

  return (
    <Autocomplete
      placeholder="Search"
      icon={<Search size={16} />}
      data={data}
      onChange={onSearchChange}
      itemComponent={SearchResultItem}
      limit={10}
      maxDropdownHeight="400px"
    />
  );
};

const useStyles = createStyles((theme) => ({
  root: {
    padding: '8px',
  },
  inner: {
    paddingTop: '0px',
  },
  searchInput: {
    minHeight: '36px',
    height: '36px',
    paddingTop: '5px',
    paddingBottom: '7px',
  },
  actions: {
    overflow: 'auto',
    maxHeight: '400px',
  },
}));
