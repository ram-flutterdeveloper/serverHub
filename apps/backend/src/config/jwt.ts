import dotenv from "dotenv";

dotenv.config();

export const jwtConfig = {
  accessSecret: process.env.JWT_ACCESS_SECRET as string,
  refreshSecret: process.env.JWT_REFRESH_SECRET as string,

  accessExpires: (process.env.JWT_ACCESS_EXPIRES || "15m") as
    | number
    | `${number}${"ms" | "s" | "m" | "h" | "d" | "w" | "y"}`,

  refreshExpires: (process.env.JWT_REFRESH_EXPIRES || "7d") as
    | number
    | `${number}${"ms" | "s" | "m" | "h" | "d" | "w" | "y"}`,
};