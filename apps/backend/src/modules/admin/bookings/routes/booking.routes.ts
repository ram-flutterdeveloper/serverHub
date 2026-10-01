import { Router } from "express";

import bookingController
    from "../controllers/booking.controller";
import { authMiddleware } from "../../../../middlewares/auth.middleware";
import { adminMiddleware } from "../../../../middlewares/adminAuth.middleware";
import assignProviderController from "../controllers/assign-provider.controller";
import { assignProviderValidator } from "../validators/assign-provider.validator";


const router = Router();

router.get(
    "/dashboard",
    authMiddleware,
    adminMiddleware,
    bookingController.dashboard
);

router.get(
    "/",
    authMiddleware,
    adminMiddleware,
    bookingController.getAll
);

router.get(
    "/:id",
    authMiddleware,
    adminMiddleware,
    bookingController.getById
);

router.patch(
  "/:bookingId/assign-provider",
  authMiddleware,
  assignProviderValidator,
  assignProviderController.assign
);

export default router;