import { Request, Response } from "express";

import subCategoryService from "../services/sub-category.service";

import { asyncHandler } from "../../../helpers/asyncHandler";
import { ApiResponseHelper } from "../../../helpers/api-response";

class SubCategoryController {
  create = asyncHandler(async (req: Request, res: Response) => {
    const subCategory = await subCategoryService.create(req.body);

    return ApiResponseHelper.success(
      res,
      subCategory,
      "Sub Category created successfully"
    );
  });

  getAll = asyncHandler(async (_req: Request, res: Response) => {
    const subCategories = await subCategoryService.getAll();

    return ApiResponseHelper.success(
      res,
      subCategories,
      "Sub Categories fetched successfully"
    );
  });

  getByService = asyncHandler(async (req: Request, res: Response) => {
    const subCategories = await subCategoryService.getByService(
      req.params.serviceId as string
    );

    return ApiResponseHelper.success(
      res,
      subCategories,
      "Sub Categories fetched successfully"
    );
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const subCategory = await subCategoryService.update(
      req.params.id as string,
      req.body
    );

    return ApiResponseHelper.success(
      res,
      subCategory,
      "Sub Category updated successfully"
    );
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await subCategoryService.delete(req.params.id as string);

    return ApiResponseHelper.success(
      res,
      null,
      "Sub Category deleted successfully"
    );
  });
}

export default new SubCategoryController();