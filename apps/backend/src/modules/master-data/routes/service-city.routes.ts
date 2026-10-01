import { Router } from "express";

import serviceCityController
  from "../controllers/service-city.controller";

const router = Router();

router.put(
  "/:serviceId/cities",
  serviceCityController.updateCities
);

router.get(
  "/:serviceId/cities",
  serviceCityController.getCities
);

export default router;