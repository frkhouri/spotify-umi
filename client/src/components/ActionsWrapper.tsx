import { Chip, createStyles } from '@mantine/core';
import { Dispatch, SetStateAction } from 'react';

export function ActionsWrapper({
  children,
  types,
  setTypes,
}: {
  children: React.ReactNode;
  types: string[];
  setTypes: Dispatch<SetStateAction<string[]>>;
}) {
  const { classes } = useStyles();
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

  return (
    <div>
      <Chip.Group
        multiple
        value={types}
        noWrap
        onChange={setTypes}
        className={classes.chipGroup}
      >
        {chips.map((chip) => (
          <Chip value={chip.value} variant="filled" size="sm" key={chip.value}>
            {chip.text}
          </Chip>
        ))}
      </Chip.Group>
      {children}
    </div>
  );
}

const useStyles = createStyles((theme) => ({
  chipGroup: {
    overflow: 'auto',
    padding: '0 5px 7px 5px',
    scrollbarWidth: 'none',
    '::-webkit-scrollbar': {
      display: 'none',
    },
  },
}));
