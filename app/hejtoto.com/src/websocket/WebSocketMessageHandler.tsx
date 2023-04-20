import { useWebSocket } from '@/websocket/WebSocketContext';
import { useEffect } from 'react';

const WebSocketMessageHandler = () => {
  const ws = useWebSocket();

  useEffect(() => {
    if (ws) {
      const handleMessage = (event) => {
        const data = JSON.parse(event.data);
        console.log(`${data.from}: ${data.message}`);
      };

      // Handle WebSocket messages in your app
      ws.ws.addEventListener('message', handleMessage);

      // Clean up the listener when the component is unmounted
      return () => {
        ws.ws.removeEventListener('message', handleMessage);
      };
    }
  }, [ws]);

  return null;
};

export default WebSocketMessageHandler;
