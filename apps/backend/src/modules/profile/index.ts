import { Router } from "express";
import profileRoutes from "./routes/profile.routes";

const router = Router();

router.use("/profile", profileRoutes);

export default router;