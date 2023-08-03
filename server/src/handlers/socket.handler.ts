import { Server, Socket } from "socket.io";

import { ListEvent } from "../common/enums";
import { Database } from "../data/database";
import { ReorderService } from "../services/reorder.service";
import { EventManager } from "../logging/EventManager";

abstract class SocketHandler {
  protected db: Database;
  protected reorderService: ReorderService;
  protected io: Server;
  protected socket: Socket;
  protected events: EventManager;

  public constructor(
    io: Server,
    db: Database,
    reorderService: ReorderService,
    socket: Socket,
    eventManager: EventManager
  ) {
    this.io = io;
    this.db = db;
    this.reorderService = reorderService;
    this.socket = socket;
    this.events = eventManager;
  }

  public abstract handleConnection(socket: Socket): void;

  protected updateLists(): void {
    this.io.emit(ListEvent.UPDATE, this.db.getData());
  }
}

export { SocketHandler };
