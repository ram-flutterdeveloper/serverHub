import { Router } from "express";

import { authMiddleware }
  from "../../../middlewares/auth.middleware";

import reviewController
  from "../controllers/review.controller";

const router = Router();

router.get(
  "/reviews",
  authMiddleware,
  reviewController.providerReviews
);

export default router;