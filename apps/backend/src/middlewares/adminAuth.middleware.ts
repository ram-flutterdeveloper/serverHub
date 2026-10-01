import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";
import { AppError } from "../helpers/AppError";
import { UserRole } from "../constants/user-role";

export const adminMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {

  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  if (req.user.role !== UserRole.ADMIN) {
    throw new AppError(
      "Only admin can access this API",
      403
    );
  }
next();
};