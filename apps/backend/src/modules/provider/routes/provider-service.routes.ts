import { Router } from "express";

import providerServiceController from "../controllers/provider-service.controller";

import { authMiddleware } from "../../../middlewares/auth.middleware";

import { providerServiceValidator } from "../validators/provider-service.validator";

const router = Router();

router.post(
    "/",
    authMiddleware,
    providerServiceValidator,
    providerServiceController.add
);

router.get(
    "/",
    authMiddleware,
    providerServiceController.getMyServices
);

router.delete(
    "/:id",
    authMiddleware,
    providerServiceController.remove
);

export default router;