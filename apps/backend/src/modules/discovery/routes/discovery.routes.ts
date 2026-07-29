import { Router } from "express";

import discoveryController from "../controllers/discovery.controller";

const router = Router();

router.get(
    "/home",
    discoveryController.home
);

export default router;