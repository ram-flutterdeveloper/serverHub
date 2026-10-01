import { Router } from "express";

import providerController
from "../controllers/provider.controller";

import { adminMiddleware } from "../../../../middlewares/adminAuth.middleware";
import { authMiddleware } from "../../../../middlewares/auth.middleware";


const router = Router();

router.get(
    "/dashboard",
    authMiddleware,
    adminMiddleware,
    providerController.dashboard
);

router.get(
    "/",
    authMiddleware,
    adminMiddleware,
    providerController.getAll
);

router.get(
    "/:id",
    authMiddleware,
    adminMiddleware,
    providerController.getById
);

router.patch(
    "/:id/approve",
    authMiddleware,
    adminMiddleware,
    providerController.approve
);

router.patch(
    "/:id/reject",
    authMiddleware,
    adminMiddleware,
    providerController.reject
);

router.patch(
    "/:id/suspend",
    authMiddleware,
    adminMiddleware,
    providerController.suspend
);

router.patch(
    "/:id/activate",
    authMiddleware,
    adminMiddleware,
    providerController.activate
);

router.patch(
    "/:id/verify-kyc",
    authMiddleware,
    adminMiddleware,
    providerController.verifyKyc
);

router.patch(
    "/:id/commission",
    authMiddleware,
    adminMiddleware,
    providerController.updateCommission
);

export default router;