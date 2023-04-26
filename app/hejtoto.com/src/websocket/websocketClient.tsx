// websocketClient.tsx

// only import websocket if not server side rendering
let WebSocket;
if (typeof window === 'undefined') {
  try {
    WebSocket = require('isomorphic-ws');
  } catch (error) {
    console.error('Failed to load isomorphic-ws', error);
  }
} else {
  WebSocket = window.WebSocket;
}
//import WebSocket from 'isomorphic-ws';

const serverAddress =
  process.env.NEXT_PUBLIC_WEBSOCKET_SERVER_ENV === 'local'
    ? 'localhost:8765'
    : 'orchester:8765';

class WebSocketClient {
  ws: WebSocket;
  displayNumber: string;
  reconnectInterval: number;

  constructor(public alias: string, displayNumber: string) {
    this.displayNumber = displayNumber;
    this.reconnectInterval = 2000; // Reconnect every 2 secondss

    // Only connect when serverEnv is not 'local'
    if (process.env.NEXT_PUBLIC_WEBSOCKET_SERVICE_ENV == 'useWebsocket') {
      console.log('WebSocket connecting ..');
      this.connect();
    } else {
      console.log('WebSocket failed');
    }
  }

  connect() {
    console.log(`Connecting to WebSocket server at ${serverAddress}`);
    this.ws = new WebSocket(`ws://${serverAddress}`);

    this.ws.addEventListener('open', () => {
      console.log('WebSocket Client Connected');
      this.ws.send(this.alias);
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
    if (this.ws.readyState === WebSocket.OPEN) {
      console.log(
        `Sending message: ${message} to ${target} with displayNumber: ${this.displayNumber}`
      );
      this.ws.send(
        JSON.stringify({ target, message, displayNumber: this.displayNumber })
      );
    } else {
      console.log('WebSocket not ready for sending messages.');
    }
  }
}

export default WebSocketClient;

// websocketClient.tsx

// only import websocket if not server side rendering
// let WebSocket;
// if (typeof window === 'undefined') {
//   try {
//     WebSocket = require('isomorphic-ws');
//   } catch (error) {
//     console.error('Failed to load isomorphic-ws', error);
//   }
// } else {
//   WebSocket = window.WebSocket;
// }

// import WebSocket from 'isomorphic-ws';
// const serverEnv = process.env.WEBSOCKET_SERVER_ENV;
// const websocketServiceEnv = process.env.WEBSOCKET_SERVICE_ENV;

// const serverAddress =
//   serverEnv === 'local' ? 'localhost:8765' : 'orchester:8765';

// class WebSocketClient {
//   ws: WebSocket;
//   displayNumber: string;
//   reconnectInterval: number;

//   constructor(public alias: string, displayNumber: string) {
//     this.displayNumber = displayNumber;
//     this.reconnectInterval = 2000; // Reconnect every 2 seconds

//     // Only connect when serverEnv is not 'local'
//     if (websocketServiceEnv == 'useWebsocket') {
//       this.connect();
//     }
//   }

//   connect() {
//     console.log(`Connecting to WebSocket server at ${serverAddress}`);
//     this.ws = new WebSocket(`ws://${serverAddress}`);

//     this.ws.addEventListener('open', () => {
//       console.log('WebSocket Client Connected');
//       this.ws.send(this.alias);
//     });

//     this.ws.addEventListener('message', (message) => {
//       console.log('Received:', message.data);
//     });

//     this.ws.addEventListener('error', (error) => {
//       console.log('WebSocket error:', error);
//     });

//     this.ws.addEventListener('close', (event) => {
//       console.log('WebSocket closed:', event);
//       setTimeout(() => this.connect(), this.reconnectInterval);
//     });
//   }

//   send(target: string, message: string) {
//     if (this.ws.readyState === WebSocket.OPEN) {
//       console.log(
//         `Sending message: ${message} to ${target} with displayNumber: ${this.displayNumber}`
//       );
//       this.ws.send(
//         JSON.stringify({ target, message, displayNumber: this.displayNumber })
//       );
//     } else {
//       console.log('WebSocket not ready for sending messages.');
//     }
//   }
// }

// export default WebSocketClient;
