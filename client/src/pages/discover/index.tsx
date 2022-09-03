import { SearchBar } from '@/components';
import { AutocompleteItem, createStyles } from '@mantine/core';
import { history } from 'umi';

const useStyles = createStyles(() => ({}));

export default function DiscoverPage() {
  const { theme } = useStyles();

  const onSearchResultSelect = (item: AutocompleteItem) => {
    history.push(`${item.type}/${item.id}`);
  };

  return (
    <>
      <SearchBar onItemSelect={onSearchResultSelect} />
    </>
  );
}
