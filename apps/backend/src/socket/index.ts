import { Server } from "socket.io";
import { Server as HttpServer } from "http";

import registerSupportSocket from "../modules/support/sockets/support.socket";
import socketAuthMiddleware from "../modules/support/sockets/socket-auth.middleware";

let io: Server;

export const initializeSocket = (
  server: HttpServer
) => {

  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // ==========================================
  // Socket Authentication
  // ==========================================

  io.use(socketAuthMiddleware);

  // ==========================================
  // Connection
  // ==========================================

  io.on("connection", (socket) => {

    console.log(
      `Socket connected: ${socket.id}`
    );

    console.log(
      `User connected: ${socket.data.user?.userId}`
    );

    // Register support socket events
    registerSupportSocket(socket, io);

    // ========================================
    // Disconnect
    // ========================================

    socket.on("disconnect", (reason) => {

      console.log(
        `Socket disconnected: ${socket.id}`,
        reason
      );

    });

  });

  console.log("Socket.IO initialized");

  return io;
};

export const getIO = (): Server => {

  if (!io) {
    throw new Error(
      "Socket.IO has not been initialized"
    );
  }

  return io;
};