import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../config";
import { AppError } from "../helpers/AppError";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    mobile: string;
    role: string;
  };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError("Authorization token is required", 401);
    }

    const token = authHeader.replace("Bearer ", "");

    const decoded = jwt.verify(
      token,
      jwtConfig.accessSecret
    ) as {
      userId: string;
      mobile: string;
      role: string;
    };

    req.user = decoded;

    next();
  } catch (error) {
    next(new AppError("Unauthorized", 401));
  }
};