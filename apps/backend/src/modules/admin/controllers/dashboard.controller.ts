import { Request, Response } from "express";
import dashboardService from "../dashboard/services/dashboard.service";
import { asyncHandler } from "../../../helpers/asyncHandler";
import { ApiResponseHelper } from "../../../helpers/api-response";

class DashboardController {
    getDashboard = asyncHandler(async (req: Request, res: Response) => {
        const data = await dashboardService.execute();

        return ApiResponseHelper.success(
            res,
            data,
            "Dashboard fetched successfully"
        );
    });
}

export default new DashboardController();