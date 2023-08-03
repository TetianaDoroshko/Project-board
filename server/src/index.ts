import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { lists } from "./assets/mockData";
import { Database } from "./data/database";
import { CardHandler } from "./handlers/card.handler";
import { ListHandler } from "./handlers/list.handler";
import { ReorderService } from "./services/reorder.service";
import {
  eventManager,
  subscribeLoggers,
} from "./logging/helpers/subscribeLoggers";
import { ProxyReorderService } from "./services/reorder.service.proxy";

const PORT = 3001;

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const db = Database.Instance;
const reorderService = new ReorderService();
// PATTERN:{Proxy}
const proxyReorderService = new ProxyReorderService(reorderService);

if (process.env.NODE_ENV !== "production") {
  db.setData(lists);
}

const onConnection = (socket: Socket): void => {
  new ListHandler(
    io,
    db,
    proxyReorderService,
    socket,
    eventManager
  ).handleConnection(socket);
  new CardHandler(
    io,
    db,
    proxyReorderService,
    socket,
    eventManager
  ).handleConnection(socket);
};
// PATTERN:{Observer}
subscribeLoggers();

io.on("connection", onConnection);

httpServer.listen(PORT, () => console.log("listening on port: " + PORT));

export { httpServer };
