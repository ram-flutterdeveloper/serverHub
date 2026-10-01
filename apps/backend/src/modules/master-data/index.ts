import { Router } from "express";


import categoryRoutes from "./routes/category.routes";
import serviceRoutes from "./routes/service.routes";
import subCategoryRoutes from "./routes/sub-category.routes";
import packageRoutes from "./routes/package.routes";
import cityRoutes from "./routes/city.routes";
import areaRoutes from "./routes/area.routes";
import serviceRequirementRoutes from "./routes/service-requirement.routes";
import serviceCityRoutes from "./routes/service-city.routes";

import timeSlotRoutes from "./routes/time_slot.routes";
const router = Router();

router.use("/categories", categoryRoutes);
router.use("/services", serviceRoutes);
router.use("/services", serviceCityRoutes);
router.use("/sub-categories", subCategoryRoutes);
router.use("/packages", packageRoutes);
router.use("/cities", cityRoutes);

router.use("/areas", areaRoutes);
router.use("/service-requirements",
    serviceRequirementRoutes
);
router.use(
    "/time-slots",
    timeSlotRoutes
);

export default router;