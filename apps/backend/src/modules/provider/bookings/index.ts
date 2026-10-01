import { Router } from "express";

import acceptBookingRoutes from "./routes/accept-booking.routes";

const router = Router();

router.use("/", acceptBookingRoutes);

export default router;