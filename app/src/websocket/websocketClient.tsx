import WebSocket from 'isomorphic-ws';

const serverAddress =
  process.env.NEXT_PUBLIC_ENVIRONMENT_MODE === 'production'
    ? 'wss://devices:8765' // Use wss for production
    : 'ws://localhost:8765'; // Use wss for development

class WebSocketClient {
  ws: WebSocket | null = null; // Allow ws to be null initially
  displayNumber: string;
  reconnectInterval: number;
  clientAlias: string; // Combined alias to include displayNumber

  constructor(
    public alias: string,
    displayNumber: string,
  ) {
    this.displayNumber = displayNumber;
    this.clientAlias = `${alias}_${displayNumber}`; // Combine alias and displayNumber
    this.reconnectInterval = 2000; // Reconnect every 2 seconds

    // Only connect when serverEnv is not 'local'
    if (this.alias !== 'app_default' && displayNumber !== 'default') {
      console.log('WebSocket connecting ...');
      this.connect();
    } else {
      console.log('WebSocket connection will not be initiated for app_default');
    }
  }

  connect() {
    console.log(`Connecting to WebSocket server at ${serverAddress}`);
    this.ws = new WebSocket(serverAddress);

    this.ws.addEventListener('open', () => {
      console.log('WebSocket Client Connected.');
      // Send the combined alias (e.g., "app_1") as the initial message
      this.ws.send(this.clientAlias);
    });

    this.ws.addEventListener('message', (message) => {
      console.log('Received:', message.data);
    });

    this.ws.addEventListener('error', (error) => {
      console.log('WebSocket error:', error);
    });

    this.ws.addEventListener('close', (event) => {
      console.log('WebSocket closed:', event);
      setTimeout(() => this.connect(), this.reconnectInterval);
    });
  }

  send(target: string, message: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log(
        `Sending message: ${message} to ${target} with clientAlias: ${this.clientAlias}`,
      );
      this.ws.send(JSON.stringify({ target, message, from: this.clientAlias }));
    } else {
      console.log('WebSocket not ready for sending messages.');
    }
  }

  cleanup() {
    if (this.ws) {
      this.ws.close();
      this.ws = null; // Reset on cleanup
    }
  }

  handleMessage(callback) {
    this.addEventListener('message', (event) => {
      // Assuming the message is a JSON string
      try {
        const data = JSON.parse(event.data);
        callback(data); // Forward the entire message object
      } catch (error) {
        console.error('Error parsing message data:', error);
      }
    });
  }

  addEventListener(eventType: string, listener: (event: any) => void) {
    if (this.ws) {
      this.ws.addEventListener(eventType, listener);
    }
  }

  // You might also want to add a corresponding removeEventListener
  removeEventListener(eventType: string, listener: (event: any) => void) {
    if (this.ws) {
      this.ws.removeEventListener(eventType, listener);
    }
  }
}

export default WebSocketClient;
