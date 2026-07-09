import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Route
app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "🚀 ServiceHub API Running",
  });
});

// Error Handler (Always Last)
app.use(errorHandler);

export default app;