import { Router } from "express";

import profileRoutes from "./routes/profile.routes";
import addressRoutes from "./routes/address.routes";

const router = Router();

router.use("/profile", profileRoutes);

router.use("/profile/addresses", addressRoutes);

export default router;