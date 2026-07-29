import { Router } from "express";

import serviceController from "../controllers/service.controller";

import { authMiddleware } from "../../../middlewares/auth.middleware";

import { createServiceValidator } from "../validators/service.validator";

const router = Router();

router.post(
  "/",
  authMiddleware,
  createServiceValidator,
  serviceController.create
);

router.get(
  "/",
  serviceController.getAll
);

router.get(
  "/category/:categoryId",
  serviceController.getByCategory
);

router.put(
  "/:id",
  authMiddleware,
  createServiceValidator,
  serviceController.update
);

router.delete(
  "/:id",
  authMiddleware,
  serviceController.delete
);

export default router;