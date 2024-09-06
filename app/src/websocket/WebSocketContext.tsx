// WebSocketContext.tsx

import { createContext, useContext, useEffect, useState } from 'react';
import WebSocketClient from '@/websocket/websocketClient';
import { DisplayContext } from '@/providers/DisplayContext';

const WebSocketContext = createContext<WebSocketClient | null>(null);

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [ws, setWs] = useState<WebSocketClient | null>(null);
  const { displayNumber } = useContext(DisplayContext);

  useEffect(() => {
    if (displayNumber === 'default') {
      console.log('Waiting for displayNumber to be set...');
      return; // Wait until displayNumber is set
    }

    console.log(
      `WebSocketProvider triggered for displayNumber: ${displayNumber}`,
    );

    // Cleanup previous WebSocket connection if exists
    if (ws) {
      console.log(
        `Cleaning up previous WebSocketClient for displayNumber: ${ws.clientAlias}`,
      );
      ws.cleanup();
    }

    // Create a new WebSocketClient
    const client = new WebSocketClient('app', displayNumber);
    console.log(
      `Creating new WebSocketClient for displayNumber: ${displayNumber}`,
    );
    setWs(client);

    return () => {
      if (client) {
        console.log(
          `Cleaning up WebSocketClient for displayNumber: ${displayNumber}`,
        );
        client.cleanup();
      }
    };
  }, [displayNumber]);

  return (
    <WebSocketContext.Provider value={ws}>{children}</WebSocketContext.Provider>
  );
};
