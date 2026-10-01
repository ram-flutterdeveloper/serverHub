import { Router } from "express";


import { authMiddleware }
    from "../../../middlewares/auth.middleware";

import { adminMiddleware }
    from "../../../middlewares/adminAuth.middleware";
import timeSlotController from "../controllers/time-slot.controller";

const router = Router();

router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    timeSlotController.createMany
);

router.get(
    "/",

    timeSlotController.getAll
);

export default router;