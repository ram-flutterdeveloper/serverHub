import { Request, Response } from "express";
import sendOtpService from "../services/send-otp.service";
import { ApiResponseHelper } from "../../../helpers/api-response";
import { asyncHandler } from "../../../helpers/asyncHandler";
import verifyOtpService from "../services/verify-otp.service";
import refreshTokenService from "../services/refresh-token.service";

import googleLoginService from "../services/google-login.service";


class AuthController {
    sendOtp = asyncHandler(async (req: Request, res: Response) => {
        const { mobile } = req.body;

        const result = await sendOtpService.execute(mobile);

        return ApiResponseHelper.success(
            res,
            process.env.NODE_ENV === "development"
                ? result
                : {
                    expiresIn: result.expiresIn,
                },
            "OTP sent successfully"
        );
    });

    verifyOtp = asyncHandler(async (req, res) => {
        const { mobile, otp } = req.body;

        const result = await verifyOtpService.execute(
            mobile,
            otp
        );

        return ApiResponseHelper.success(
            res,
            result,
            "Login successful"
        );
    });

    refreshToken = asyncHandler(async (req, res) => {

        const { refreshToken } = req.body;

        const result = await refreshTokenService.execute(refreshToken);

        return ApiResponseHelper.success(
            res,
            result,
            "Token refreshed successfully"
        );




    });

   googleLogin = asyncHandler(
  async (req, res) => {
    const { idToken } = req.body;

    const data =
      await googleLoginService.execute(
        idToken
      );

    return ApiResponseHelper.success(
      res,
      data,
      "Login successful"
    );
  }
);
}

export default new AuthController();