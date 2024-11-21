import http from "http";
import { Server } from "socket.io";
import { Express } from "express";

function createSocket(app: Express) {
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  return { io, server };
}

export default createSocket;
