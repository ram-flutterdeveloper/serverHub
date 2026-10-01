import { Router } from "express";

import supportController
  from "../controllers/support.controller";
import { authMiddleware } from "../../../middlewares/auth.middleware";

const router = Router();

router.post(
  "/conversations",
  authMiddleware,
  supportController.createConversation
);

export default router;