import { Router } from "express";

import bookingRoutes from "./routes/booking.routes";

const router = Router();

router.use("/", bookingRoutes);

export default router;