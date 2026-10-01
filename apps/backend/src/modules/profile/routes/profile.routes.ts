import { Router } from "express";

import profileController from "../controllers/profile.controller";

import { authMiddleware } from "../../../middlewares/auth.middleware";
import { updateProfileValidator } from "../validators/update-profile.validator";
import { uploadAndCompressImage } from "../../../middlewares/upload.middleware";

const router = Router();

router.get(
  "/",
  authMiddleware,
  profileController.getProfile
);

// router.put(
//   "/",
//   authMiddleware,
//   updateProfileValidator,
//   profileController.updateProfile
// );

router.put(
  "/",
  authMiddleware,
  uploadAndCompressImage(
    "profile",
    "profileImage"
  ),
  updateProfileValidator,
  profileController.updateProfile
);

export default router;