import { Router } from "express";

import {
    authMiddleware
} from "../../../middlewares/auth.middleware";

import providerDashboardController
    from "../controllers/provider-dashboard.controller";

const router = Router();


router.get(
    "/dashboard",
    authMiddleware,
    providerDashboardController.getDashboard
);


export default router;