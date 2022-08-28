import { EditListModalProps } from '@/dtos';
import { Button, createStyles, Group, Modal, TextInput } from '@mantine/core';
import { useListState } from '@mantine/hooks';
import { useState } from 'react';
import { AddListItem } from './AddListItem';
import ListDragAndDrop from './ListDragAndDrop';

const EditListModal = ({
  opened,
  onSubmit,
  onClose,
  list,
}: EditListModalProps) => {
  const { classes, theme } = useStyles();
  const [state, handlers] = useListState(list.items);
  const [name, setName] = useState(list.name);

  const onCancel = () => {
    onClose();
    handlers.setState(list.items);
  };

  return (
    <Modal
      opened={opened}
      onClose={onCancel}
      title={
        <TextInput
          placeholder="Title"
          defaultValue={name}
          onChange={(e) => setName(e.target.value)}
        />
      }
      centered
      overflow="inside"
      overlayColor={
        theme.colorScheme === 'dark'
          ? theme.colors.dark[9]
          : theme.colors.gray[2]
      }
      overlayOpacity={0.55}
      overlayBlur={3}
    >
      <div className={classes.listWrapper}>
        <ListDragAndDrop state={state} handlers={handlers} />
        <AddListItem />
      </div>
      <Group position="right">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={() => onSubmit({ _id: list._id, name: name, items: state })}
        >
          Save
        </Button>
      </Group>
    </Modal>
  );
};

const useStyles = createStyles(() => ({
  listWrapper: {
    maxHeight: '400px',
  },
}));

export default EditListModal;
