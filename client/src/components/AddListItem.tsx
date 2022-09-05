import { createStyles, Text } from '@mantine/core';
import { Plus } from 'tabler-icons-react';

type AddListItemProps = {
  onClick: () => void;
};

export const AddListItem = ({ onClick }: AddListItemProps) => {
  const { classes } = useStyles();

  return (
    <div className={classes.item} onClick={onClick}>
      <div className={classes.leftIcon}>
        <Plus size={18} />
      </div>
      <div>
        <Text color="dimmed">Add Item</Text>
      </div>
    </div>
  );
};

const useStyles = createStyles((theme) => ({
  item: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: theme.radius.md,
    border: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
    padding: `${theme.spacing.sm}px ${theme.spacing.xl}px`,
    paddingLeft: theme.spacing.xl - theme.spacing.md, // to offset drag handle
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.white,
    marginBottom: theme.spacing.sm,
  },

  leftIcon: {
    ...theme.fn.focusStyles(),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[1]
        : theme.colors.gray[6],
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
  },
}));
