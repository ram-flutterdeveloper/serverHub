import { Request, Response } from "express";
import packageService from "../services/package.service";
import { asyncHandler } from "../../../helpers/asyncHandler";
import { ApiResponseHelper } from "../../../helpers/api-response";

class PackageController {
  create = asyncHandler(async (req: Request, res: Response) => {
    const result = await packageService.create(req.body);

    return ApiResponseHelper.success(
      res,
      result,
      "Package created successfully"
    );
  });

  getAll = asyncHandler(async (_req: Request, res: Response) => {
    const result = await packageService.getAll();

    return ApiResponseHelper.success(
      res,
      result,
      "Packages fetched successfully"
    );
  });

  getBySubCategory = asyncHandler(async (req: Request, res: Response) => {
    const result = await packageService.getBySubCategory(
      req.params.subCategoryId as string
    );

    return ApiResponseHelper.success(
      res,
      result,
      "Packages fetched successfully"
    );
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const result = await packageService.update(
      req.params.id as string,
      req.body
    );

    return ApiResponseHelper.success(
      res,
      result,
      "Package updated successfully"
    );
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await packageService.delete(req.params.id as string);

    return ApiResponseHelper.success(
      res,
      null,
      "Package deleted successfully"
    );
  });
}

export default new PackageController();