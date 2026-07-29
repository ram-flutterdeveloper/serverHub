import authRepository from "../repositories/auth.repository";
import { AppError } from "../../../helpers/AppError";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../../helpers/jwt";

class VerifyOtpService {
  async execute(mobile: string, otp: string) {
    const otpRecord = await authRepository.findLatestOtp(mobile);

    if (!otpRecord) {
      throw new AppError("OTP not found", 400);
    }

    if (otpRecord.verifiedAt) {
      throw new AppError("OTP already verified", 400);
    }

    if (new Date() > otpRecord.expiresAt) {
      throw new AppError("OTP expired", 400);
    }

    if (otpRecord.otp !== otp) {
      throw new AppError("Invalid OTP", 400);
    }

    await authRepository.markOtpVerified(otpRecord.id);

    let user = await authRepository.findUserByMobile(mobile);

    if (!user) {
      user = await authRepository.createUser({
        mobile,
        countryCode: "+91",
        isMobileVerified: true,
        isProfileCompleted: false,
      });
    }

    const payload = {
      userId: user.id,
      mobile: user.mobile,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);

    const refreshToken = generateRefreshToken(payload);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }
}

export default new VerifyOtpService();