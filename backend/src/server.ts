import http from "http";
import app from "./app";
import { setupWebSocket } from "./websocket/ws.server";
import { startWorker } from "./worker/workerService";

const server = http.createServer(app);

setupWebSocket(server);

startWorker();

server.listen(4000, () => {
  console.log("Backend running on http://localhost:4000");
});

