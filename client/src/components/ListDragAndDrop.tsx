import { DragAndDropListItem, ListDragAndDropProps } from '@/dtos';
import { createStyles, Text } from '@mantine/core';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { GripVertical } from 'tabler-icons-react';

const ListItem = ({ props }: DragAndDropListItem) => {
  const { classes, cx } = useStyles();
  const { item, provided, snapshot } = props;

  return (
    <div
      className={cx(classes.item, {
        [classes.itemDragging]: snapshot.isDragging,
      })}
      ref={provided.innerRef}
      key={item.id}
      {...provided.draggableProps}
    >
      <div {...provided.dragHandleProps} className={classes.dragHandle}>
        <GripVertical size={18} />
      </div>
      {/* <Text className={classes.symbol}>{item.symbol}</Text> */}
      <div>
        <Text>{item.name}</Text>
        {/* <Text color="dimmed" size="sm">
              Position: {item.position} • Mass: {item.mass}
            </Text> */}
      </div>
    </div>
  );
};

const ListDragAndDrop = ({ state, handlers }: ListDragAndDropProps) => {
  const { classes } = useStyles();
  return (
    <DragDropContext
      onDragEnd={({ destination, source }) =>
        handlers.reorder({
          from: source.index,
          to: destination?.index ?? source.index,
        })
      }
    >
      <Droppable
        droppableId="dnd-list"
        direction="vertical"
        renderClone={(provided, snapshot, rubric) => (
          <ListItem
            props={{ item: state[rubric.source.index], provided, snapshot }}
          />
        )}
      >
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={classes.listWrapper}
          >
            {state.map((item, index) => (
              <Draggable key={item.id} index={index} draggableId={item.id}>
                {(provided, snapshot) => (
                  <ListItem props={{ item, provided, snapshot }} />
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

const useStyles = createStyles((theme) => ({
  listWrapper: {
    height: '250px',
    overflow: 'auto',
    scrollbarWidth: 'none',
    '::-webkit-scrollbar': {
      display: 'none',
    },
  },

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

  itemDragging: {
    boxShadow: theme.shadows.sm,
    position: 'static',
  },

  symbol: {
    fontSize: 30,
    fontWeight: 700,
    width: 60,
  },

  dragHandle: {
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

export default ListDragAndDrop;
