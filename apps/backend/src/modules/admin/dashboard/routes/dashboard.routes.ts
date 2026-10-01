import { Router } from "express";
import dashboardController from "../../controllers/dashboard.controller";
import { authMiddleware } from "../../../../middlewares/auth.middleware";
import { adminMiddleware } from "../../../../middlewares/adminAuth.middleware";

const router = Router();

router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  dashboardController.getDashboard
);

export default router;