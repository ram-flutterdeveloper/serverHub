export * from "./config/firebase";
import { Router } from "express";

import deviceTokenRoutes from "./routes/device-token.routes";

const router = Router();

router.use(deviceTokenRoutes);

export default router;