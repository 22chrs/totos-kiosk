import WebSocket from 'isomorphic-ws';

const serverAddress =
  process.env.NEXT_PUBLIC_ENVIRONMENT_MODE === 'production'
    ? 'wss://devices:8765' // Use wss for production
    : 'ws://localhost:8765'; // Use ws for development

// Log the server address to check the current WebSocket endpoint
console.log('WebSocket Server Address:', serverAddress);

class WebSocketClient {
  ws: WebSocket | null = null; // Allow ws to be null initially
  displayNumber: string;
  reconnectInterval: number;
  clientAlias: string; // Combined alias to include displayNumber
  static instanceCounter = 0; // Track the number of instances

  constructor(
    public alias: string,
    displayNumber: string,
  ) {
    WebSocketClient.instanceCounter++; // Increment instance counter
    console.log(
      `WebSocketClient instance created. Total instances: ${WebSocketClient.instanceCounter}`,
    );

    this.displayNumber = displayNumber;
    this.clientAlias = `${alias}_${displayNumber}`; // Combine alias and displayNumber
    this.reconnectInterval = 2000; // Reconnect every 2 seconds

    // Only connect when serverEnv is not 'local'
    if (this.alias !== 'app_default' && displayNumber !== 'default') {
      console.log('WebSocket connecting ...', `Alias: ${this.clientAlias}`);
      this.connect();
    } else {
      console.log(
        'WebSocket connection will not be initiated for app_default or default displayNumber',
      );
    }
  }

  connect() {
    console.log(
      `Connecting to WebSocket server at ${serverAddress} with clientAlias: ${this.clientAlias}`,
    );
    this.ws = new WebSocket(serverAddress);

    this.ws.addEventListener('open', () => {
      console.log('WebSocket Client Connected.');
      this.ws?.send(this.clientAlias);
    });

    this.ws.addEventListener('message', (message) => {
      console.log('Received:', message.data);
    });

    this.ws.addEventListener('error', (error) => {
      console.log('WebSocket error:', error);
    });

    this.ws.addEventListener('close', (event) => {
      console.log(
        `WebSocket closed for clientAlias ${this.clientAlias}:`,
        event,
      );
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
      console.log(
        `WebSocket not ready for sending messages. ClientAlias: ${this.clientAlias}`,
      );
    }
  }

  cleanup() {
    if (this.ws) {
      console.log(`Cleaning up WebSocket for clientAlias: ${this.clientAlias}`);
      this.ws.close();
      this.ws = null; // Reset on cleanup
    }
    WebSocketClient.instanceCounter--; // Decrement instance counter
    console.log(
      `WebSocketClient instance destroyed. Remaining instances: ${WebSocketClient.instanceCounter}`,
    );
  }

  handleMessage(callback: (data: any) => void) {
    this.addEventListener('message', (event) => {
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

  removeEventListener(eventType: string, listener: (event: any) => void) {
    if (this.ws) {
      this.ws.removeEventListener(eventType, listener);
    }
  }
}

export default WebSocketClient;
