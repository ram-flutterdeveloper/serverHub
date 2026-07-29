import { Response } from "express";

import { AuthRequest } from "../../../middlewares/auth.middleware";
import { asyncHandler } from "../../../helpers/asyncHandler";
import { ApiResponseHelper } from "../../../helpers/api-response";

import providerServiceService from "../services/provider-service.service";

class ProviderServiceController {

    add = asyncHandler(async (
        req: AuthRequest,
        res: Response
    ) => {

        const result = await providerServiceService.add(
            req.user!.userId,
            req.body.serviceId
        );

        return ApiResponseHelper.success(
            res,
            result,
            "Service added successfully"
        );

    });

    getMyServices = asyncHandler(async (
        req: AuthRequest,
        res: Response
    ) => {

        const result = await providerServiceService.getMyServices(
            req.user!.userId
        );

        return ApiResponseHelper.success(
            res,
            result,
            "Services fetched successfully"
        );

    });

    remove = asyncHandler(async (
        req: AuthRequest,
        res: Response
    ) => {

        await providerServiceService.remove(
            req.user!.userId,
             req.params.id as string
        );

        return ApiResponseHelper.success(
            res,
            null,
            "Service removed successfully"
        );

    });

}

export default new ProviderServiceController();