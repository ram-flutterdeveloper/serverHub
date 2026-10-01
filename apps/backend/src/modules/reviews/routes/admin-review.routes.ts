import { Router } from "express";

import { authMiddleware }
  from "../../../middlewares/auth.middleware";

import reviewController
  from "../controllers/review.controller";

const router = Router();


// Get all
router.get(
  "/reviews",
  authMiddleware,
  reviewController.adminGetAll
);


// Create
router.post(
  "/reviews",
  authMiddleware,
  reviewController.adminCreate
);


// Update
router.patch(
  "/reviews/:id",
  authMiddleware,
  reviewController.adminUpdate
);


// Delete
router.delete(
  "/reviews/:id",
  authMiddleware,
  reviewController.adminDelete
);


export default router;