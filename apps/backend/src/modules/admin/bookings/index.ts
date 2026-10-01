import { Router } from "express";

import bookingRoutes from "./routes/booking.routes";
import availableProviderRoutes from "./routes/available-provider.routes";

const router = Router();

router.use("/", bookingRoutes);
router.use("/", availableProviderRoutes);

export default router;