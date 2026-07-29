import jwt from "jsonwebtoken";
import { jwtConfig } from "../config";

export const generateAccessToken = (payload: object): string => {
  return jwt.sign(payload, jwtConfig.accessSecret, {
    expiresIn: jwtConfig.accessExpires,
  });
};

export const generateRefreshToken = (payload: object): string => {
  return jwt.sign(payload, jwtConfig.refreshSecret, {
    expiresIn: jwtConfig.refreshExpires,
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, jwtConfig.accessSecret);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, jwtConfig.refreshSecret);
};