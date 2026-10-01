import { Request } from "express";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    mobile: string;
    role: string;
  };
}