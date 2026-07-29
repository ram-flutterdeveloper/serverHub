import { Request, Response } from "express";

import areaService from "../services/area.service";

import { asyncHandler } from "../../../helpers/asyncHandler";
import { ApiResponseHelper } from "../../../helpers/api-response";

class AreaController {
  create = asyncHandler(async (req: Request, res: Response) => {
    const area = await areaService.create(req.body);

    return ApiResponseHelper.success(
      res,
      area,
      "Area created successfully"
    );
  });

  getAll = asyncHandler(async (_req: Request, res: Response) => {
    const areas = await areaService.getAll();

    return ApiResponseHelper.success(
      res,
      areas,
      "Areas fetched successfully"
    );
  });

  getByCity = asyncHandler(async (req: Request, res: Response) => {
    const areas = await areaService.getByCity(
      req.params.cityId as string
    );

    return ApiResponseHelper.success(
      res,
      areas,
      "Areas fetched successfully"
    );
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const area = await areaService.update(
      req.params.id as string,
      req.body
    );

    return ApiResponseHelper.success(
      res,
      area,
      "Area updated successfully"
    );
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await areaService.delete(req.params.id as string);

    return ApiResponseHelper.success(
      res,
      null,
      "Area deleted successfully"
    );
  });
}

export default new AreaController();