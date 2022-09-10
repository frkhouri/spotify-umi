import { EditListModalProps, ListItem } from '@/dtos';
import {
  Affix,
  Button,
  createStyles,
  Divider,
  FocusTrap,
  Group,
  Modal,
  Overlay,
  TextInput,
  Transition,
} from '@mantine/core';
import { useListState } from '@mantine/hooks';
import { useState } from 'react';
import { AddListItem } from './AddListItem';
import ListDragAndDrop from './ListDragAndDrop';
import { SearchBar } from './SearchBar';

const EditListModal = ({
  opened,
  onSubmit,
  onClose,
  list,
}: EditListModalProps) => {
  const { classes, theme } = useStyles();
  const [state, handlers] = useListState(list.items);
  const [name, setName] = useState(list.name);
  const [searchBarOpen, setSearchBarOpen] = useState(false);

  const onCancel = () => {
    onClose();
    setSearchBarOpen(false);
    handlers.setState(list.items);
  };

  const onSelectSearchResult = (item: ListItem) => {
    if (item.type === 'show') {
      handlers.append({
        ...item,
        owner: {
          id: item.id,
          name: item.name,
        },
      });
    } else {
      handlers.append(item);
    }
    setSearchBarOpen(false);
  };

  return (
    <Modal
      opened={opened}
      onClose={onCancel}
      trapFocus={false}
      title={
        <TextInput
          placeholder="Title"
          defaultValue={name}
          onChange={(e) => setName(e.target.value)}
        />
      }
      centered
      overlayColor={
        theme.colorScheme === 'dark'
          ? theme.colors.dark[9]
          : theme.colors.gray[2]
      }
      overlayOpacity={0.55}
      overlayBlur={3}
    >
      {searchBarOpen && (
        <Overlay
          color={
            theme.colorScheme === 'dark'
              ? theme.colors.dark[9]
              : theme.colors.gray[2]
          }
          opacity={0.55}
          blur={3}
          onClick={() => setSearchBarOpen(false)}
        />
      )}
      <FocusTrap active={searchBarOpen}>
        <Affix position={{ top: 10, left: 10, right: 10 }}>
          <Transition
            mounted={searchBarOpen}
            transition="slide-down"
            duration={200}
            timingFunction="ease"
          >
            {(styles) => (
              <SearchBar
                onItemSelect={(item) => onSelectSearchResult(item)}
                style={styles}
              />
            )}
          </Transition>
        </Affix>
      </FocusTrap>
      <div className={classes.listWrapper}>
        <ListDragAndDrop state={state} handlers={handlers} />
        <Divider p={5} />
        <AddListItem onClick={() => setSearchBarOpen(true)} />
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
