import { Router } from "express";

import profileController from "../controllers/profile.controller";

import { authMiddleware } from "../../../middlewares/auth.middleware";
import { updateProfileValidator } from "../validators/update-profile.validator";

const router = Router();

router.get(
  "/",
  authMiddleware,
  profileController.getProfile
);

router.put(
  "/",
  authMiddleware,
  updateProfileValidator,
  profileController.updateProfile
);

export default router;