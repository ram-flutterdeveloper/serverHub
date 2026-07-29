import { Response } from "express";

import { AuthRequest } from "../../../middlewares/auth.middleware";
import { asyncHandler } from "../../../helpers/asyncHandler";
import { ApiResponseHelper } from "../../../helpers/api-response";

import providerLocationService from "../services/provider-location.service";

class ProviderLocationController {

    save = asyncHandler(async (
        req: AuthRequest,
        res: Response
    ) => {

        const result = await providerLocationService.save(
            req.user!.userId,
            req.body
        );

        return ApiResponseHelper.success(
            res,
            result,
            "Provider location saved successfully"
        );

    });

    getMyLocation = asyncHandler(async (
        req: AuthRequest,
        res: Response
    ) => {

        const result = await providerLocationService.getMyLocation(
            req.user!.userId
        );

        return ApiResponseHelper.success(
            res,
            result,
            "Provider location fetched successfully"
        );

    });

}

export default new ProviderLocationController();