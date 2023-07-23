

import { io } from "socket.io-client";

export const initSocket = async () => {
  const options = {
    "force new connection": true,
    reconnectionAttempt: "Infinity",
    transports: ["websocket"],
  };


  const socket = io("http://localhost:8000", options);

  socket.on("error", (error) => {
    console.error("WebSocket connection error:", error);
  });

  return socket;
};
