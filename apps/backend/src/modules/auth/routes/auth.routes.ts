import { Router } from "express";
import authController from "../controllers/auth.controller";
import { sendOtpValidator } from "../validators/send-otp.validator";
import { verifyOtpValidator } from "../validators/verify-otp.validator";
import { authMiddleware } from "../../../middlewares/auth.middleware";


const router = Router();



router.post(
  "/send-otp",
  sendOtpValidator,
  authController.sendOtp
);

router.post(
  "/verify-otp",
  verifyOtpValidator,
  authController.verifyOtp
);
router.post(
  "/refresh-token",
  authController.refreshToken
);

router.post(
  "/google",
  authController.googleLogin
);
router.post(
  "/logout",
  authMiddleware,
  authController.logout
);


// ==========================================
// DELETE ACCOUNT
// ==========================================

router.delete(
  "/account",
  authMiddleware,
  authController.deleteAccount
);

export default router;