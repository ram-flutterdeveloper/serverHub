import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: process.env.PORT || "5000",
  NODE_ENV: process.env.NODE_ENV || "development",

  DATABASE_URL: process.env.DATABASE_URL || "",

  JWT_SECRET: process.env.JWT_SECRET || "",

  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "",

  GOOGLE_MAP_KEY: process.env.GOOGLE_MAP_KEY || "",

  CLOUDINARY_NAME: process.env.CLOUDINARY_NAME || "",

  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",

  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",
};