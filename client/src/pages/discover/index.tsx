import { SearchBar } from '@/components';
import { ListItem } from '@/dtos';
import { createStyles } from '@mantine/core';
import { history } from 'umi';

const useStyles = createStyles(() => ({}));

export default function DiscoverPage() {
  const { theme } = useStyles();

  const onSearchResultSelect = (item: ListItem) => {
    history.push(`${item.type}/${item.id}`);
  };

  return (
    <>
      <SearchBar onItemSelect={onSearchResultSelect} />
    </>
  );
}
