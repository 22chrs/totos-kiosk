// WebSocketContext.tsx

import { DisplayContext } from '@/providers/DisplayContext';
import WebSocketClient from '@/websocket/websocketClient';
import { createContext, useContext, useEffect, useState } from 'react';

const WebSocketContext = createContext<WebSocketClient | null>(null);

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [ws, setWs] = useState<WebSocketClient | null>(null);
  const { displayNumber } = useContext(DisplayContext); // Get displayNumber from DisplayContexts

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_WEBSOCKET_SERVER_ENV) {
      const client = new WebSocketClient('app', displayNumber); // Pass displayNumber here
      setWs(client);

      return () => {
        client.ws.close();
      };
    }
  }, [displayNumber]); // Add displayNumber to useEffect dependencies

  return (
    <WebSocketContext.Provider value={ws}>{children}</WebSocketContext.Provider>
  );
};
