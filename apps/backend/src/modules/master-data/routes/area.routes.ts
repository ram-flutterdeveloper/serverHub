import { Router } from "express";

import areaController from "../controllers/area.controller";

import { authMiddleware } from "../../../middlewares/auth.middleware";

import { createAreaValidator } from "../validators/area.validator";

const router = Router();

router.post(
  "/",
  authMiddleware,
  createAreaValidator,
  areaController.create
);

router.get(
  "/",
  areaController.getAll
);

router.get(
  "/city/:cityId",
  areaController.getByCity
);

router.put(
  "/:id",
  authMiddleware,
  createAreaValidator,
  areaController.update
);

router.delete(
  "/:id",
  authMiddleware,
  areaController.delete
);

export default router;