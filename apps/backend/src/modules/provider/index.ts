import { Router } from "express";
import providerRoutes from "./routes/provider.routes";
import providerLocationRoutes from "./routes/provider-location.routes";
import providerServiceRoutes from "./routes/provider-service.routes";
import providerWorkingHourRoutes from "./routes/provider-working-hour.routes";
import providerDocumentRoutes from "./routes/provider-document.routes";
import providerBankAccountRoutes from "./routes/provider-bank-account.routes";
import acceptBookingRoutes from "./bookings/routes/accept-booking.routes";
import providerBookingRoutes from "./bookings";
import providerDashboardRoutes from "./routes/provider-dashboard.routes";

const router = Router();
router.use(
    "/provider",
    providerDashboardRoutes
);

router.use("/provider", providerRoutes);

router.use(
    "/me/location",
    providerLocationRoutes
);
router.use("/", acceptBookingRoutes);

router.use(
    "/me/services",
    providerServiceRoutes
);
router.use(
    "/me/working-hours",
    providerWorkingHourRoutes
);

router.use(
    "/me/documents",
    providerDocumentRoutes
);
router.use(
    "/providers/me/bank-account",
    providerBankAccountRoutes
);



router.use("/provider/bookings", providerBookingRoutes);
export default router;