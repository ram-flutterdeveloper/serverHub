import { Response } from "express";

import { AuthRequest } from "../../../middlewares/auth.middleware";
import { asyncHandler } from "../../../helpers/asyncHandler";
import { ApiResponseHelper } from "../../../helpers/api-response";

import providerDashboardService
    from "../services/provider-dashboard.service";


class ProviderDashboardController {

    getDashboard = asyncHandler(

        async (
            req: AuthRequest,
            res: Response
        ) => {

            const data =
                await providerDashboardService
                    .getDashboard(
                        req.user!.userId
                    );


            return ApiResponseHelper.success(

                res,

                data,

                "Provider dashboard fetched successfully"

            );

        }

    );

}


export default new ProviderDashboardController();