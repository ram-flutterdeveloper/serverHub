import { Router } from "express";

import serviceRequirementController from "../controllers/service-requirement.controller";

import { authMiddleware } from "../../../middlewares/auth.middleware";

import { createRequirementValidator } from "../validators/service-requirement.validator";

const router = Router();

router.post(
    "/",
    authMiddleware,
    createRequirementValidator,
    serviceRequirementController.create
);

router.get(
    "/",
    serviceRequirementController.getAll
);

router.get(
    "/package/:packageId",
    serviceRequirementController.getByPackage
);

router.put(
    "/:id",
    authMiddleware,
    createRequirementValidator,
    serviceRequirementController.update
);

router.delete(
    "/:id",
    authMiddleware,
    serviceRequirementController.delete
);

export default router;