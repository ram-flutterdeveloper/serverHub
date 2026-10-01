import { Router } from "express";

import { authMiddleware } from "../../../middlewares/auth.middleware";

import addressController from "../controllers/address.controller";

import {
  createAddressValidator,
  updateAddressValidator,
} from "../validators/address.validator";

const router = Router();

router.post(
  "/",
  authMiddleware,
  createAddressValidator,
  addressController.create
);

router.get(
  "/",
  authMiddleware,
  addressController.getAll
);

router.put(
  "/:id",
  authMiddleware,
  updateAddressValidator,
  addressController.update
);

router.delete(
  "/:id",
  authMiddleware,
  addressController.delete
);

router.patch(
  "/:id/default",
  authMiddleware,
  addressController.setDefault
);

export default router;