import { Router } from "express";

import categoryRoutes from "./routes/category.routes";
import serviceRoutes from "./routes/service.routes";
import subCategoryRoutes from "./routes/sub-category.routes";
import packageRoutes from "./routes/package.routes";
import cityRoutes from "./routes/city.routes";
import areaRoutes from "./routes/area.routes";
import serviceRequirementRoutes from "./routes/service-requirement.routes";
const router = Router();

router.use("/categories", categoryRoutes);
router.use("/services", serviceRoutes);
router.use("/sub-categories", subCategoryRoutes);
router.use("/packages", packageRoutes);
router.use("/cities", cityRoutes);

router.use("/areas", areaRoutes);
router.use(
    "/service-requirements",
    serviceRequirementRoutes
);

export default router;