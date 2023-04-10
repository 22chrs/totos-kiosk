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
    // Create a new WebSocketClient with the environment variable
    const client = new WebSocketClient(process.env.NEXT_PUBLIC_WEBSOCKET_SERVER as string);
    setWs(client);

    return () => {
      client.ws.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={ws}>{children}</WebSocketContext.Provider>
  );
};
