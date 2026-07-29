import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { errorHandler } from "./middlewares/error.middleware.js";
import { setupSwagger } from "./config/swagger.js";
import authModule from "./modules/auth";
import profileModule from "./modules/profile";
import discoveryModule from "./modules/discovery";
import providerModule from "./modules/provider";
import catalogModule from "./modules/master-data";
import masterDataModule from "./modules/master-data";




const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", authModule);
app.use("/api/v1", profileModule);
app.use("/api/v1", discoveryModule);
app.use("/api/v1", providerModule);
app.use("/api/v1", catalogModule);
app.use("/api/v1", masterDataModule);



// Health Check Route
app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "🚀 ServiceHub API Running",
  });
});

// Error Handler (Always Last)
app.use(errorHandler);

setupSwagger(app);
export default app;