import { Router } from "express";

import providerLocationController from "../controllers/provider-location.controller";

import { authMiddleware } from "../../../middlewares/auth.middleware";

import { providerLocationValidator } from "../validators/provider-location.validator";

const router = Router();

router.post(
    "/",
    authMiddleware,
    providerLocationValidator,
    providerLocationController.save
);

router.get(
    "/",
    authMiddleware,
    providerLocationController.getMyLocation
);

router.put(
    "/",
    authMiddleware,
    providerLocationValidator,
    providerLocationController.save
);

export default router;