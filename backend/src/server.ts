import http from "http";
import app from "./app";
import { wss, broadcast } from "./websocket/ws.server";
import { worker } from "./workers/worker.manager";
import { queue } from "./services/queue.service";
import { ProcessStatus } from "../../shared/types/process";

const server = http.createServer(app);

server.on("upgrade", (req, socket, head) => {
  if (req.url === "/ws") {
    wss.handleUpgrade(req, socket, head, ws => {
      wss.emit("connection", ws, req);
    });
  }
});

worker.on("message", ({ id, result }) => {
  const item = queue.get(id);
  if (!item) return;

  const updated = { id, status: ProcessStatus.DONE, result };
  queue.set(id, updated);

  broadcast(updated);
});

server.listen(4000, () => {
  console.log("Backend running on http://localhost:4000");
});

