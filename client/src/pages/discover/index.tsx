import { SearchButton } from '@/components';
import { createStyles } from '@mantine/core';
import axios from 'axios';

const useStyles = createStyles(() => ({}));

export default function DiscoverPage() {
  const { theme } = useStyles();

  const handleClick = async (attribute?: string, threshold?: number) => {
    await axios.get('/im-feeling-lucky', {
      params: {
        ...(attribute && {
          [attribute]: threshold,
        }),
      },
    });
  };

  return (
    <>
      <SearchButton />
    </>
  );
}
