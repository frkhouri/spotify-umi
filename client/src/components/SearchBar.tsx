import { SearchResult } from '@/dtos';
import {
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Card,
  Chip,
  createStyles,
  Group,
  Input,
  Space,
  Text,
} from '@mantine/core';
import axios from 'axios';
import { forwardRef, useEffect, useState } from 'react';
import { Search } from 'tabler-icons-react';

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

const chips = [
  {
    value: 'album',
    text: 'Albums',
  },
  {
    value: 'artist',
    text: 'Artists',
  },
  {
    value: 'playlist',
    text: 'Playlists',
  },
  {
    value: 'track',
    text: 'Tracks',
  },
  {
    value: 'show',
    text: 'Shows',
  },
  {
    value: 'episode',
    text: 'Episodes',
  },
];

type SearchBarProps = {
  onItemSelect: (item: AutocompleteItem) => void;
};

export const SearchBar = ({ onItemSelect }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState([]);
  const [types, setTypes] = useState(['album', 'artist', 'playlist']);
  const [filterVisible, setFilterVisible] = useState(false);
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
          results?.map((result: SearchResult) => ({
            ...result,
            value: result.name,
            group: `${result.type}s`.toUpperCase(),
          })),
        );
    }, 750);

    return () => clearTimeout(search);
  }, [searchTerm, types]);

  const onSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <div>
      <Input.Wrapper>
        <Autocomplete
          placeholder="Search"
          icon={<Search size={16} />}
          data={data}
          onChange={onSearchChange}
          itemComponent={SearchResultItem}
          limit={10}
          maxDropdownHeight="400px"
          onDropdownOpen={() => setFilterVisible(true)}
          onDropdownClose={() => setFilterVisible(false)}
          onItemSubmit={(item) => onItemSelect(item)}
          classNames={{ dropdown: classes.dropdown }}
        />
        {filterVisible && (
          <Card shadow="md" p="xs" className={classes.typeFilter}>
            <Chip.Group
              multiple
              value={types}
              noWrap
              onChange={(v) => setTypes(v)}
            >
              {chips.map((chip) => (
                <Chip
                  value={chip.value}
                  variant="filled"
                  size="xs"
                  radius="sm"
                  key={chip.value}
                >
                  {chip.text}
                </Chip>
              ))}
              <Space w={1} h="xs" />
            </Chip.Group>
          </Card>
        )}
      </Input.Wrapper>
    </div>
  );
};

const useStyles = createStyles((theme) => ({
  dropdown: {
    marginTop: '50px',
  },
  typeFilter: {
    overflow: 'auto',
    marginTop: '5px',
    border: `1px solid ${theme.colors.gray[3]}`,
    scrollbarWidth: 'none',
    '::-webkit-scrollbar': {
      display: 'none',
    },
  },
}));
