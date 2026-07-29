import { Request, Response } from "express";

import cityService from "../services/city.service";

import { asyncHandler } from "../../../helpers/asyncHandler";
import { ApiResponseHelper } from "../../../helpers/api-response";

class CityController {
  create = asyncHandler(async (req: Request, res: Response) => {
    const city = await cityService.create(req.body);

    return ApiResponseHelper.success(
      res,
      city,
      "City created successfully"
    );
  });

  getAll = asyncHandler(async (_req: Request, res: Response) => {
    const cities = await cityService.getAll();

    return ApiResponseHelper.success(
      res,
      cities,
      "Cities fetched successfully"
    );
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const city = await cityService.update(
      req.params.id as string,
      req.body
    );

    return ApiResponseHelper.success(
      res,
      city,
      "City updated successfully"
    );
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await cityService.delete(req.params.id as string);

    return ApiResponseHelper.success(
      res,
      null,
      "City deleted successfully"
    );
  });
}

export default new CityController();