import { Request, Response } from "express";



import availableProviderService
from "../services/available-provider.service";
import { asyncHandler } from "../../../../helpers/asyncHandler";
import { ApiResponseHelper } from "../../../../helpers/api-response";

class AvailableProviderController {

    getProviders = asyncHandler(
        async (req: Request, res: Response) => {

            const providers =
                await availableProviderService.execute(
                    req.params.bookingId as string
                );

            return ApiResponseHelper.success(
                res,
                providers,
                "Available providers fetched successfully"
            );

        }
    );

}

export default new AvailableProviderController();