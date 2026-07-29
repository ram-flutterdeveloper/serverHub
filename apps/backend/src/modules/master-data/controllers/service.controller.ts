import { Request, Response } from "express";

import serviceService from "../services/service.service";

import { asyncHandler } from "../../../helpers/asyncHandler";
import { ApiResponseHelper } from "../../../helpers/api-response";

class ServiceController {
    create = asyncHandler(async (req: Request, res: Response) => {
        const service = await serviceService.create(req.body);

        return ApiResponseHelper.success(
            res,
            service,
            "Service created successfully"
        );
    });

    getAll = asyncHandler(async (req: Request, res: Response) => {
        const services = await serviceService.getAll();

        return ApiResponseHelper.success(
            res,
            services,
            "Services fetched successfully"
        );
    });

    getByCategory = asyncHandler(async (req: Request, res: Response) => {
        const services = await serviceService.getByCategory(
            req.params.categoryId as string
        );

        return ApiResponseHelper.success(
            res,
            services,
            "Services fetched successfully"
        );
    });

    update = asyncHandler(async (req: Request, res: Response) => {
        const service = await serviceService.update(
            req.params.id as string,
            req.body
        );

        return ApiResponseHelper.success(
            res,
            service,
            "Service updated successfully"
        );
    });

    delete = asyncHandler(async (req: Request, res: Response) => {
        await serviceService.delete(req.params.id as string);

        return ApiResponseHelper.success(
            res,
            null,
            "Service deleted successfully"
        );
    });
}

export default new ServiceController();