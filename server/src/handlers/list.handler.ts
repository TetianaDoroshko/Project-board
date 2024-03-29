import type { Socket } from "socket.io";

import { ListEvent, LogEvent } from "../common/enums";
import { List } from "../data/models/list";
import { SocketHandler } from "./socket.handler";

export class ListHandler extends SocketHandler {
  public handleConnection(socket: Socket): void {
    socket.on(ListEvent.CREATE, this.createList.bind(this));
    socket.on(ListEvent.GET, this.getLists.bind(this));
    socket.on(ListEvent.REORDER, this.reorderLists.bind(this));
    socket.on(ListEvent.RENAME, this.renameList.bind(this));
    socket.on(ListEvent.DELETE, this.deleteList.bind(this));
  }

  private getLists(callback: (cards: List[]) => void): void {
    callback(this.db.getData());
  }

  private reorderLists(sourceIndex: number, destinationIndex: number): void {
    const lists = this.db.getData();
    const reorderedLists = this.reorderService.reorder(
      lists,
      sourceIndex,
      destinationIndex
    );
    this.db.setData(reorderedLists);
    this.updateLists();
    // PATTERN:{Observer}
    this.events.notify(LogEvent.INFO, {
      client: this.socket.id,
      action: ListEvent.REORDER,
      entity: "",
    });
  }

  private createList(name: string): void {
    const lists = this.db.getData();
    const newList = new List(name);
    this.db.setData(lists.concat(newList));
    this.updateLists();
    // PATTERN:{Observer}
    this.events.notify(LogEvent.INFO, {
      client: this.socket.id,
      action: ListEvent.CREATE,
      entity: newList.id,
    });
  }

  private renameList(listId: string, name: string): void {
    const lists = this.db.getData();
    const newLists = lists.map((list) => {
      if (list.id === listId) {
        list.name = name;
      }
      return list;
    });
    this.db.setData(newLists);
    this.updateLists();
    // PATTERN:{Observer}
    this.events.notify(LogEvent.INFO, {
      client: this.socket.id,
      action: ListEvent.RENAME,
      entity: listId,
    });
  }

  private deleteList(listId: string): void {
    const lists = this.db.getData();
    this.db.setData(lists.filter((list) => list.id !== listId));
    this.updateLists();
    // PATTERN:{Observer}
    this.events.notify(LogEvent.INFO, {
      client: this.socket.id,
      action: ListEvent.DELETE,
      entity: listId,
    });
  }
}
