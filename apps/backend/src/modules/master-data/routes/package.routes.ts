import { Router } from "express";

import packageController from "../controllers/package.controller";
import { authMiddleware } from "../../../middlewares/auth.middleware";
import { createPackageValidator } from "../validators/package.validator";
import { uploadAndCompressImage } from "../../../middlewares/upload.middleware";
import packageDetailsController from "../controllers/package-details.controller";

const router = Router();

router.post(
  "/",
  authMiddleware,
  uploadAndCompressImage("packages"),
  createPackageValidator,
  packageController.create
);

router.get(
  "/",
  packageController.getAll
);

router.get(
  "/services/:serviceId",
  packageController.getByService
);

router.get(
  "/sub-category/:subCategoryId",
  packageController.getBySubCategory
);

router.put(
  "/:id",
  authMiddleware,
  uploadAndCompressImage("packages"),
  createPackageValidator,
  packageController.update
);

// create PACKAGE DETAILS
router.post(
  "/:packageId/details",
  authMiddleware,
  packageDetailsController.create
);
// get PACKAGE DETAILS
router.get(
  "/:packageId/details",
  packageDetailsController.get
);


// UPDATE PACKAGE DETAILS
router.put(
  "/:packageId/details",
  authMiddleware,
  packageDetailsController.update
);


router.delete(
  "/:id",
  authMiddleware,
  packageController.delete
);

export default router;


