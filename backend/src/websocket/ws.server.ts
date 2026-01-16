import { WebSocketServer } from "ws";

export const wss = new WebSocketServer({ noServer: true });

export function broadcast(message: any) {
  const data = JSON.stringify(message);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(data);
    }
  });
}
