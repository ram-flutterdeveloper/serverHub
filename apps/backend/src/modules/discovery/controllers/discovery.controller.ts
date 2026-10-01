
import { Request, Response } from "express";

import discoveryService from "../services/discovery.service";

import {
  asyncHandler
} from "../../../helpers/asyncHandler";

import {
  ApiResponseHelper
} from "../../../helpers/api-response";

class DiscoveryController {

  home = asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      const latitude =
        Number(req.query.latitude);

      const longitude =
        Number(req.query.longitude);

      if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "latitude and longitude are required",
        });
      }

      const result =
        await discoveryService.home(
          latitude,
          longitude
        );

      return ApiResponseHelper.success(
        res,
        result,
        "Home data fetched successfully"
      );
    }
  );

}

export default new DiscoveryController();