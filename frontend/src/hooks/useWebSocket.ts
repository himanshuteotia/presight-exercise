import { useEffect } from "react";

export function useWebSocket(onMessage: (data: any) => void) {
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:4000/ws");

    socket.onmessage = (event) => {
      onMessage(JSON.parse(event.data));
    };

    return () => socket.close();
  }, []);
}
