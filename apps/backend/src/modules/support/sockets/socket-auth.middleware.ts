import { Socket } from "socket.io";

import {
  verifyAccessToken,
} from "../../../helpers/jwt";

const socketAuthMiddleware = (
  socket: Socket,
  next: (err?: Error) => void
) => {

  try {

    // ==========================================
    // Get token from Flutter/Web client
    // ==========================================

    const token =
      socket.handshake.auth?.token;

    if (!token) {

      return next(
        new Error(
          "Authentication required"
        )
      );

    }

    // ==========================================
    // Verify JWT
    // ==========================================

    const decoded =
      verifyAccessToken(token);

    if (!decoded) {

      return next(
        new Error(
          "Invalid access token"
        )
      );

    }

    // ==========================================
    // Store user inside socket
    // ==========================================

    socket.data.user = decoded;

    next();

  } catch (error) {

    console.error(
      "Socket authentication failed:",
      error
    );

    next(
      new Error(
        "Invalid or expired access token"
      )
    );

  }
};

export default socketAuthMiddleware;