import { Router } from "express";
import providerRoutes from "./routes/provider.routes";
import providerLocationRoutes from "./routes/provider-location.routes";
import providerServiceRoutes from "./routes/provider-service.routes";
import providerWorkingHourRoutes from "./routes/provider-working-hour.routes";
import providerDocumentRoutes from "./routes/provider-document.routes";
import providerBankAccountRoutes from "./routes/provider-bank-account.routes";
const router = Router();

router.use("/provider", providerRoutes);
router.use(
    "/me/location",
    providerLocationRoutes
);

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
    "/me/bank-account",
    providerBankAccountRoutes
);
export default router;