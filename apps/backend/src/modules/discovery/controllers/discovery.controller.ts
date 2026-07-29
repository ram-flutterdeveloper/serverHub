// import { Request, Response } from "express";
// import { asyncHandler } from "../../../helpers/asyncHandler";
// import { ApiResponseHelper } from "../../../helpers/api-response";
// import discoveryService from "../services/discovery.service";

// class DiscoveryController {
//   getDiscovery = asyncHandler(async (req: Request, res: Response) => {
//     const cityId = req.query.cityId as string;
//     const areaId = req.query.areaId as string;

//     const data = await discoveryService.getDiscovery(
//       cityId,
//       areaId
//     );

//     return ApiResponseHelper.success(
//       res,
//       data,
//       "Discovery loaded successfully"
//     );
//   });
// }

// export default new DiscoveryController();

import { Request, Response } from "express";

import discoveryService from "../services/discovery.service";

import { asyncHandler } from "../../../helpers/asyncHandler";
import { ApiResponseHelper } from "../../../helpers/api-response";

class DiscoveryController {

    home = asyncHandler(async(req:Request,res:Response)=>{

        const result = await discoveryService.home(
            req.query.cityId as string
        );

        return ApiResponseHelper.success(
            res,
            result,
            "Home data fetched successfully"
        );

    });

}

export default new DiscoveryController();