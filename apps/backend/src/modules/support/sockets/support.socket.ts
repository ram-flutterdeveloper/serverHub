import {
  Server,
  Socket,
} from "socket.io";

const registerSupportSocket = (
  socket: Socket,
  io: Server
) => {

  // ==========================================
  // JOIN SUPPORT CONVERSATION
  // ==========================================

  socket.on(
    "support:join",
    async (conversationId: string) => {

      try {

        const room =
          `support:${conversationId}`;

        socket.join(room);

        console.log(
          `User ${socket.data.user.userId} joined ${room}`
        );

        socket.emit(
          "support:joined",
          {
            conversationId,
          }
        );

      } catch (error) {

        console.error(
          "Support join error:",
          error
        );

      }

    }
  );


  // ==========================================
  // LEAVE SUPPORT CONVERSATION
  // ==========================================

  socket.on(
    "support:leave",
    async (conversationId: string) => {

      const room =
        `support:${conversationId}`;

      socket.leave(room);

      console.log(
        `User ${socket.data.user.userId} left ${room}`
      );

    }
  );


  // ==========================================
  // TYPING START
  // ==========================================

  socket.on(
    "support:typing:start",
    (conversationId: string) => {

      socket
        .to(`support:${conversationId}`)
        .emit(
          "support:typing:start",
          {
            userId:
              socket.data.user.userId,
          }
        );

    }
  );


  // ==========================================
  // TYPING STOP
  // ==========================================

  socket.on(
    "support:typing:stop",
    (conversationId: string) => {

      socket
        .to(`support:${conversationId}`)
        .emit(
          "support:typing:stop",
          {
            userId:
              socket.data.user.userId,
          }
        );

    }
  );

};

export default registerSupportSocket;