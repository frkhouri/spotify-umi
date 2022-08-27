import { DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';

type Item = {
  id: string;
  name: string;
};

export type ListDragAndDropProps = {
  data: Item[];
};

export type DragAndDropListItem = {
  props: {
    item: Item;
    provided: DraggableProvided;
    snapshot: DraggableStateSnapshot;
  };
};
