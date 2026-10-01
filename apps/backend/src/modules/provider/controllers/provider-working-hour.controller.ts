import { Response } from "express";

import { AuthRequest } from "../../../middlewares/auth.middleware";
import { asyncHandler } from "../../../helpers/asyncHandler";
import { ApiResponseHelper } from "../../../helpers/api-response";

import providerWorkingHourService from "../services/provider-working-hour.service";

class ProviderWorkingHourController {

    save = asyncHandler(async (
        req: AuthRequest,
        res: Response
    ) => {

        const result = await providerWorkingHourService.save(
            req.user!.userId,
            req.body
        );

        return ApiResponseHelper.success(
            res,
            result,
            "Working hours saved successfully"
        );

    });

    getMyWorkingHours = asyncHandler(async (
        req: AuthRequest,
        res: Response
    ) => {

        const result = await providerWorkingHourService.getMyWorkingHours(
            req.user!.userId
        );

        return ApiResponseHelper.success(
            res,
            result,
            "Working hours fetched successfully"
        );

    });

    delete = asyncHandler(async (
        req: AuthRequest,
        res: Response
    ) => {

        await providerWorkingHourService.delete(
            req.user!.userId,
            req.params.id as string
        );

        return ApiResponseHelper.success(
            res,
            null,
            "Working hour deleted successfully"
        );

    });

    update = asyncHandler(
    async (
        req: AuthRequest,
        res: Response
    ) => {

        const result =
            await providerWorkingHourService.update(
                req.user!.userId,
                req.params.id as string,
                req.body
            );

        return ApiResponseHelper.success(
            res,
            result,
            "Working hours updated successfully"
        );
    }
);

}

export default new ProviderWorkingHourController();