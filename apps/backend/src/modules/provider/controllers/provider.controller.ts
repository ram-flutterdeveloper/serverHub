import { Response } from "express";

import providerService from "../services/provider.service";
import providerLocationService from "../services/provider-location.service";

import { asyncHandler } from "../../../helpers/asyncHandler";
import { ApiResponseHelper } from "../../../helpers/api-response";

import { AuthRequest } from "../../../middlewares/auth.middleware";

class ProviderController {

    register = asyncHandler(async (req: AuthRequest, res: Response) => {

        const provider = await providerService.register(
            req.user!.userId,
            req.body
        );

        return ApiResponseHelper.success(
            res,
            provider,
            "Provider registered successfully"
        );

    });

    getMyProfile = asyncHandler(async (req: AuthRequest, res: Response) => {

        const provider = await providerService.getMyProfile(
            req.user!.userId
        );

        return ApiResponseHelper.success(
            res,
            provider,
            "Provider profile fetched successfully"
        );

    });

    updateMyProfile = asyncHandler(async (req: AuthRequest, res: Response) => {

        const provider = await providerService.updateMyProfile(
            req.user!.userId,
            req.body
        );

        return ApiResponseHelper.success(
            res,
            provider,
            "Provider profile updated successfully"
        );

    });

    getById = asyncHandler(async (req: AuthRequest, res: Response) => {

        const provider = await providerService.getById(
            req.params.id as string
        );

        return ApiResponseHelper.success(
            res,
            provider,
            "Provider fetched successfully"
        );

    });

    saveLocation = asyncHandler(async (req: AuthRequest, res: Response) => {

        const location = await providerLocationService.save(
            req.user!.userId,
            req.body
        );

        return ApiResponseHelper.success(
            res,
            location,
            "Location saved successfully"
        );

    });

}

export default new ProviderController();