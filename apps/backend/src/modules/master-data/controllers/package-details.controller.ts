import { Request, Response } from "express";

import { asyncHandler } from "../../../helpers/asyncHandler";
import { ApiResponseHelper } from "../../../helpers/api-response";
import packageDetailsService from "../services/package-details-service";



class PackageDetailsController {

    create = asyncHandler(
        async (req: Request, res: Response) => {

            const result =
                await packageDetailsService.create(

                    req.params.packageId as string,

                    req.body

                );

            return ApiResponseHelper.success(
                res,
                result,
                "Package details created successfully"
            );

        }
    );

    get = asyncHandler(
        async (
            req: Request,
            res: Response
        ) => {

            const result =
                await packageDetailsService.get(

                    req.params.packageId as string

                );

            return ApiResponseHelper.success(

                res,

                result,

                "Package details fetched successfully"

            );
        }
    );
    update = asyncHandler(
        async (
            req: Request,
            res: Response
        ) => {

            const result =
                await packageDetailsService.update(

                    req.params.packageId as string,

                    req.body

                );

            return ApiResponseHelper.success(

                res,

                result,

                "Package details updated successfully"

            );
        }
    );
}

export default new PackageDetailsController();