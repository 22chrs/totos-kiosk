// WebSocketContext.tsx

import { createContext, useContext, useEffect, useState } from "react";
import WebSocketClient from "@/websocket/websocketClient";

const WebSocketContext = createContext<WebSocketClient | null>(null);

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ws, setWs] = useState<WebSocketClient | null>(null);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_WEBSOCKET_SERVER) {
      const client = new WebSocketClient("app");
      setWs(client);

      return () => {
        client.ws.close();
      };
    }
  }, []);

  return (
    <WebSocketContext.Provider value={ws}>{children}</WebSocketContext.Provider>
  );
};