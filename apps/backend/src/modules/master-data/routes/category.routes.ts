import { Router } from "express";

import categoryController from "../controllers/category.controller";

import { authMiddleware } from "../../../middlewares/auth.middleware";

import { createCategoryValidator } from "../validators/category.validator";
import { adminMiddleware } from "../../../middlewares/adminAuth.middleware";
import { uploadAndCompressImage } from "../../../middlewares/upload.middleware";

const router = Router();

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
   uploadAndCompressImage(
    "categories"
  ),
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
 uploadAndCompressImage(
    "categories"
  ),
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