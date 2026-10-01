import { Router } from "express";

import cityController from "../controllers/city.controller";

import { authMiddleware } from "../../../middlewares/auth.middleware";

import { createCityValidator, updateCityValidator } from "../validators/city.validator";

const router = Router();

router.post(
  "/",
  authMiddleware,
  createCityValidator,
  cityController.create
);

router.get(
  "/",
  cityController.getAll
);

router.put(
  "/:id",
  authMiddleware,
  updateCityValidator,
  cityController.update
);

router.delete(
  "/:id",
  authMiddleware,
  cityController.delete
);

export default router;