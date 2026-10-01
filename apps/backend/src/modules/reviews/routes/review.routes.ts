import { Router } from "express";

import { authMiddleware }
  from "../../../middlewares/auth.middleware";

import reviewController
  from "../controllers/review.controller";

import {
  createReviewValidator,
} from "../validators/create-review.validator";

const router = Router();


// ==================================================
// USER
// ==================================================

// Get package reviews
router.get(
  "/package/:packageId",
  reviewController.packageReviews
);


// Create review
router.post(
  "/",
  authMiddleware,
  createReviewValidator,
  reviewController.create
);





export default router;