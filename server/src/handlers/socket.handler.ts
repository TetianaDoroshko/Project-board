import { Server, Socket } from "socket.io";

import { ListEvent } from "../common/enums";
import { Database } from "../data/database";
import { ReorderService } from "../services/reorder.service";
import { EventManager } from "../logging/EventManager";
import { IReorderService } from "../common/types/reorder.service.interface";

abstract class SocketHandler {
  protected db: Database;
  protected reorderService: IReorderService;
  protected io: Server;
  protected socket: Socket;
  protected events: EventManager;

  public constructor(
    io: Server,
    db: Database,
    reorderService: IReorderService,
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
