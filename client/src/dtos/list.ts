import { UseListStateHandlers } from '@mantine/hooks';
import { DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';

export type HorizontalListProps = {
  list: List;
  setItems: (updatedList: List) => Promise<void>;
};

export type List = {
  _id: string;
  name: string;
  items: ListItem[];
};

export type ListItem = {
  id: string;
  name: string;
  description?: string;
  image?: string;
  type: 'playlist' | 'album' | 'show' | 'artist';
  owner?: {
    id: string;
    name: string;
  };
};

export type EditListModalProps = {
  opened: boolean;
  onClose: () => void;
  onSubmit: (updatedList: List) => void;
  list: List;
};

export type ListDragAndDropProps = {
  state: ListItem[];
  handlers: UseListStateHandlers<ListItem>;
};

export type DragAndDropListItem = {
  props: {
    item: ListItem;
    provided: DraggableProvided;
    snapshot: DraggableStateSnapshot;
  };
};
