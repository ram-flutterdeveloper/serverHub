import "socket.io";

declare module "socket.io" {

  interface SocketData {

    user: {
      userId: string;
      mobile?: string;
      role: string;
    };

  }

}