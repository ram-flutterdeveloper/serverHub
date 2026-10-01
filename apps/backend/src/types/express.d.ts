import "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        mobile: string;
        role: string;
      };
    }
  }
}

export {};