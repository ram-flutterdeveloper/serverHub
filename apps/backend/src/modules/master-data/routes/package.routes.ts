import { Router } from "express";

import packageController from "../controllers/package.controller";
import { authMiddleware } from "../../../middlewares/auth.middleware";
import { createPackageValidator } from "../validators/package.validator";

const router = Router();

router.post(
  "/",
  authMiddleware,
  createPackageValidator,
  packageController.create
);

router.get(
  "/",
  packageController.getAll
);

router.get(
  "/sub-category/:subCategoryId",
  packageController.getBySubCategory
);

router.put(
  "/:id",
  authMiddleware,
  createPackageValidator,
  packageController.update
);

router.delete(
  "/:id",
  authMiddleware,
  packageController.delete
);

export default router;