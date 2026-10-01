import { Request, Response } from "express";

import { asyncHandler } from "../../../helpers/asyncHandler";
import { ApiResponseHelper } from "../../../helpers/api-response";

import service from "../services/device-token.service";
import { AuthRequest } from "../../../middlewares/auth.middleware";

class DeviceTokenController {

  register = asyncHandler(
    async (req: AuthRequest, res: Response) => {

      const result = await service.register({
        userId: req.user!.userId,
        token: req.body.token,
        platform: req.body.platform,
        deviceId: req.body.deviceId,
      });

      return ApiResponseHelper.success(
        res,
        result,
        "Device token registered successfully"
      );
    }
  );

}

export default new DeviceTokenController();