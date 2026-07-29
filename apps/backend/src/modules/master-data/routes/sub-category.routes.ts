import { Router } from "express";

import subCategoryController from "../controllers/sub-category.controller";
import { authMiddleware } from "../../../middlewares/auth.middleware";
import { createSubCategoryValidator } from "../validators/sub-category.validator";

const router = Router();

router.post(
  "/",
  authMiddleware,
  createSubCategoryValidator,
  subCategoryController.create
);

router.get(
  "/",
  subCategoryController.getAll
);

router.get(
  "/service/:serviceId",
  subCategoryController.getByService
);

router.put(
  "/:id",
  authMiddleware,
  createSubCategoryValidator,
  subCategoryController.update
);

router.delete(
  "/:id",
  authMiddleware,
  subCategoryController.delete
);

export default router;