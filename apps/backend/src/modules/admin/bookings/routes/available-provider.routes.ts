import { Router } from "express";




import availableProviderController
from "../controllers/available-provider.controller";
import { authMiddleware } from "../../../../middlewares/auth.middleware";
import { adminMiddleware } from "../../../../middlewares/adminAuth.middleware";

const router = Router();

router.get(
    "/:bookingId/providers",
    authMiddleware,
    adminMiddleware,
    availableProviderController.getProviders
);

export default router;