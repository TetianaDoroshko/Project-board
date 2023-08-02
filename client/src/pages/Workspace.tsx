import type {
  DraggableLocation,
  DroppableProvided,
  DropResult,
} from "@hello-pangea/dnd";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import React, { useContext, useEffect, useState } from "react";

import { CardEvent, ListEvent } from "../common/enums";
import type { List } from "../common/types";
import { Column } from "../components/column/column";
import { ColumnCreator } from "../components/column-creator/column-creator";
import { SocketContext } from "../context/socket";
import { reorderService } from "../services/reorder.service";
import { Container } from "./styled/container";

export const Workspace = () => {
  const [lists, setLists] = useState<List[]>([]);

  const socket = useContext(SocketContext);

  useEffect(() => {
    socket.emit(ListEvent.GET, (lists: List[]) => setLists(lists));
    socket.on(ListEvent.UPDATE, (lists: List[]) => setLists(lists));

    return () => {
      socket.removeAllListeners(ListEvent.UPDATE).close();
    };
  }, []);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const source: DraggableLocation = result.source;
    const destination: DraggableLocation = result.destination;

    const isNotMoved =
      source.droppableId === destination.droppableId &&
      source.index === destination?.index;

    if (isNotMoved) {
      return;
    }

    const isReorderLists = result.type === "COLUMN";

    if (isReorderLists) {
      setLists(
        reorderService.reorderLists(lists, source.index, destination.index)
      );
      socket.emit(ListEvent.REORDER, source.index, destination.index);

      return;
    }

    setLists(reorderService.reorderCards(lists, source, destination));
    socket.emit(CardEvent.REORDER, {
      sourceListId: source.droppableId,
      destinationListId: destination.droppableId,
      sourceIndex: source.index,
      destinationIndex: destination.index,
    });
  };

  const createList = (name: string): void => {
    socket.emit(ListEvent.CREATE, name);
  };

  const removeList = (listId: string): void => {
    socket.emit(ListEvent.DELETE, listId);
  };

  const renameList =
    (listId: string): ((name: string) => void) =>
    (name: string): void => {
      socket.emit(ListEvent.RENAME, listId, name);
    };

  return (
    <React.Fragment>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="board" type="COLUMN" direction="horizontal">
          {(provided: DroppableProvided) => (
            <Container
              className="workspace-container"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {lists.map((list: List, index: number) => (
                <Column
                  key={list.id}
                  index={index}
                  listName={list.name}
                  cards={list.cards}
                  listId={list.id}
                  onListRemove={removeList}
                  onListRename={renameList(list.id)}
                />
              ))}
              {provided.placeholder}
              <ColumnCreator onCreateList={createList} />
            </Container>
          )}
        </Droppable>
      </DragDropContext>
    </React.Fragment>
  );
};
