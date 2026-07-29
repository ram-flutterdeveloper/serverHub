import { Router } from "express";
import providerController from "../controllers/provider.controller";
import { authMiddleware } from "../../../middlewares/auth.middleware";
import { registerProviderValidator } from "../validators/provider.validator";
import { providerLocationValidator } from "../validators/provider-location.validator";

const router = Router();

router.post(
    "/register",
    authMiddleware,
    registerProviderValidator,
    providerController.register
);

router.get(
    "/me",
    authMiddleware,
    providerController.getMyProfile
);
router.get(
    "/:id",
    providerController.getById
);
router.post(
    "/location",
    authMiddleware,
    providerLocationValidator,
    providerController.saveLocation
);

export default router;