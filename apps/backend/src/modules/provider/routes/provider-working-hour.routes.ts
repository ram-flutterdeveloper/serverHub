import { Router } from "express";

import providerWorkingHourController from "../controllers/provider-working-hour.controller";

import { authMiddleware } from "../../../middlewares/auth.middleware";

import { providerWorkingHourValidator } from "../validators/provider-working-hour.validator";

const router = Router();

router.post(
    "/",
    authMiddleware,
    providerWorkingHourValidator,
    providerWorkingHourController.save
);

router.get(
    "/",
    authMiddleware,
    providerWorkingHourController.getMyWorkingHours
);

router.put(
    "/:id",
    authMiddleware,
    providerWorkingHourValidator,
    providerWorkingHourController.save
);

router.delete(
    "/:id",
    authMiddleware,
    providerWorkingHourController.delete
);

export default router;