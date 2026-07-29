import { Router } from "express";

import categoryController from "../controllers/category.controller";

import { authMiddleware } from "../../../middlewares/auth.middleware";

import { createCategoryValidator } from "../validators/category.validator";
import { adminMiddleware } from "../../../middlewares/adminAuth.middleware";

const router = Router();

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createCategoryValidator,
  categoryController.create
);

router.get(
  "/",
  categoryController.getAll
);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  createCategoryValidator,
  categoryController.update
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  categoryController.delete
);

export default router;