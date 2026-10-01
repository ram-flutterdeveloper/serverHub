import {
    Request,
    Response,
} from "express";

import {
    asyncHandler,
} from "../../../helpers/asyncHandler";

import {
    ApiResponseHelper,
} from "../../../helpers/api-response";
import serviceCityService from "../services/service-city.service";



class ServiceCityController {

    updateCities = asyncHandler(
        async (
            req: Request,
            res: Response
        ) => {

            const { serviceId } = req.params;

            const { cityIds } = req.body;


            // -----------------------------
            // Validate serviceId
            // -----------------------------

            if (
                typeof serviceId !== "string" ||
                !serviceId.trim()
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid serviceId",
                });
            }


            // -----------------------------
            // Validate cityIds
            // -----------------------------

            if (!Array.isArray(cityIds)) {
                return res.status(400).json({
                    success: false,
                    message: "cityIds must be an array",
                });
            }


            // -----------------------------
            // Validate cityIds values
            // -----------------------------

            if (
                cityIds.some(
                    (id) =>
                        typeof id !== "string" ||
                        !id.trim()
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "cityIds must contain valid IDs",
                });
            }


            // -----------------------------
            // Update service cities
            // -----------------------------

            const result =
                await serviceCityService
                    .updateServiceCities(
                        serviceId,
                        cityIds
                    );


            return ApiResponseHelper.success(
                res,
                result,
                "Service city availability updated successfully"
            );
        }
    );

   
    getCities = asyncHandler(
  async (
    req: Request,
    res: Response
  ) => {

    const { serviceId } = req.params;


    // Validate serviceId
    if (
      typeof serviceId !== "string" ||
      !serviceId.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid serviceId",
      });
    }


    const result =
      await serviceCityService.getServiceCities(
        serviceId
      );


    return ApiResponseHelper.success(
      res,
      result,
      "Service cities fetched successfully"
    );
  }
);
}


export default new ServiceCityController();