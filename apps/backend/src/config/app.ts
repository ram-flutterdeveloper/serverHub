import dotenv from "dotenv";

dotenv.config();

export const appConfig = {
  appName: process.env.APP_NAME!,
  port: Number(process.env.PORT),
  nodeEnv: process.env.NODE_ENV!,
};