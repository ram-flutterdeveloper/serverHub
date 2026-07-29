import { Request, Response } from "express";

import { asyncHandler } from "../../../helpers/asyncHandler";
import { ApiResponseHelper } from "../../../helpers/api-response";

import getProfileService from "../services/get-profile.service";
import updateProfileService from "../services/update-profile.service";

class ProfileController {
  getProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;

    const profile = await getProfileService.execute(userId);

    return ApiResponseHelper.success(
      res,
      profile,
      "Profile fetched successfully"
    );
  });

  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;

    const profile = await updateProfileService.execute(
      userId,
      req.body
    );

    return ApiResponseHelper.success(
      res,
      profile,
      "Profile updated successfully"
    );
  });
}

export default new ProfileController();