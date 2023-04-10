// WebSocketMessageHandler.tsx

import { useEffect } from 'react';
import { useWebSocket } from '@/websocket/WebSocketContext';

const WebSocketMessageHandler = () => {
  const ws = useWebSocket();

  useEffect(() => {
    if (ws) {
      // Handle WebSocket messages in your app
      ws.ws.addEventListener("message", (event) => {
        console.log(`Received message: ${event.data}`);
      });

      // Clean up the listener when the component is unmounted
      return () => {
        ws.ws.removeEventListener("message");
      };
    }
  }, [ws]);

  return null;
};

export default WebSocketMessageHandler;
