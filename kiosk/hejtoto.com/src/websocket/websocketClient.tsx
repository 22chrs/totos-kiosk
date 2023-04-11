// websocketClient.tsx

import WebSocket from "isomorphic-ws";

const serverEnv = process.env.NEXT_PUBLIC_WEBSOCKET_SERVER_ENV;

const serverAddress =
  serverEnv === "local" ? "localhost:8765" : "orchester:8765";

class WebSocketClient {
  ws: WebSocket;

  constructor(public alias: string) {
    console.log(`Connecting to WebSocket server at ${serverAddress}`);
    this.ws = new WebSocket(`ws://${serverAddress}`);

    this.ws.addEventListener("open", () => {
      console.log("WebSocket Client Connected");
      this.ws.send(alias);
    });

    this.ws.addEventListener("message", (message) => {
      console.log("Received:", message.data);
    });

    this.ws.addEventListener("error", (error) => {
      console.log("WebSocket error:", error);
    });

    this.ws.addEventListener("close", (event) => {
      console.log("WebSocket closed:", event);
    });
  }

  send(target: string, message: string) {
    if (this.ws.readyState === WebSocket.OPEN) {
      console.log(`Sending message: ${message} to ${target}`);
      this.ws.send(JSON.stringify({ target, message }));
    } else {
      console.log("WebSocket not ready for sending messages.");
    }
  }
}

export default WebSocketClient;
