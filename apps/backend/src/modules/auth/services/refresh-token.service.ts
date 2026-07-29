import jwt from "jsonwebtoken";
import authRepository from "../repositories/auth.repository";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../../helpers/jwt";
import { AppError } from "../../../helpers/AppError";

class RefreshTokenService {
  async execute(refreshToken: string) {
    const payload: any = verifyRefreshToken(refreshToken);
    const user = await authRepository.findUserByMobile(
      payload.mobile
    );
    if (!user) {
      throw new AppError("User not found", 404);
    }

    
    const newPayload = {
      userId: user.id,
      mobile: user.mobile,
      role: user.role,
    };

    return {
      accessToken: generateAccessToken(newPayload),
      refreshToken: generateRefreshToken(newPayload),
    };
  }
}

export default new RefreshTokenService();