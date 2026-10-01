import { Router } from "express";

import controller from "../controllers/device-token.controller";
import { authMiddleware } from "../../../middlewares/auth.middleware";

const router = Router();

router.post(
  "/register-device",
  authMiddleware,
  controller.register
);

export default router;