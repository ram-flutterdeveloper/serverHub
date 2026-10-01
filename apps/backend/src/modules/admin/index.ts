import { Router } from "express";
import providerRoutes from "./providers/routes/provider.routes";
import userRoutes from "./users";
import bookingModule from "./bookings";

const router = Router();

router.use("/providers", providerRoutes);
router.use("/users", userRoutes);
router.use("/bookings", bookingModule);

export default router;