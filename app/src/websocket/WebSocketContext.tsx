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
  const { displayNumber } = useContext(DisplayContext); // Get displayNumber from DisplayContext

  useEffect(() => {
    if (displayNumber !== 'default') {
      const client = new WebSocketClient('app', displayNumber);
      setWs(client);

      // Use the cleanup method for cleanup
      return () => {
        client.cleanup();
      };
    }

    // Cleanup if the component unmounts before the WebSocket is instantiated
    return () => {};
  }, [displayNumber]); // Add displayNumber to useEffect dependencies

  return (
    <WebSocketContext.Provider value={ws}>{children}</WebSocketContext.Provider>
  );
};
