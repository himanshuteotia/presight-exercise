import { useEffect } from "react";
import { env } from "../env";

export function useWebSocket(onMessage: (data: any) => void) {
  useEffect(() => {
    const socket = new WebSocket(`${env.wsBaseUrl}/ws`);

    socket.onmessage = (event) => {
      onMessage(JSON.parse(event.data));
    };

    return () => socket.close();
  }, []);
}
