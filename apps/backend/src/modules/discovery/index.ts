import { Router } from "express";
import discoveryRoutes from "./routes/discovery.routes";

const router = Router();

router.use(
    "/discovery",
    discoveryRoutes
);

export default router;