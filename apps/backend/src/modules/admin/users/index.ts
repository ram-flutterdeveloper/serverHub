import { Router } from "express";
import userRoutes from "./routes/user.routes";

const router = Router();

router.use("/", userRoutes);

export default router;