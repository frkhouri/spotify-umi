import { ListItem } from '@/dtos';
import { Button, createStyles, Group, Modal, TextInput } from '@mantine/core';
import ListDragAndDrop from './ListDragAndDrop';

type EditListModalProps = {
  opened: boolean;
  onClose: () => void;
  title: string;
  data: ListItem[];
};

const EditListModal = ({
  opened,
  onClose,
  title,
  data,
}: EditListModalProps) => {
  const { classes, theme } = useStyles();

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<TextInput placeholder="Title" defaultValue={title} />}
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
        <ListDragAndDrop data={data} />
      </div>
      <Group position="right">
        <Button variant="outline">Cancel</Button>
        <Button>Save</Button>
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
