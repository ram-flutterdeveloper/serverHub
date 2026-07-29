import authRepository from "../repositories/auth.repository";
import { GoogleHelper } from "../helpers/google.helper";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../../helpers/jwt";

class GoogleLoginService {
  async execute(idToken: string) {
    const googleUser = await GoogleHelper.verifyToken(idToken);

    // 1. Find by Google ID
    let user = await authRepository.findByGoogleId(
      googleUser.googleId
    );

    // 2. If not found, find by email
    if (!user && googleUser.email) {
      user = await authRepository.findByEmail(
        googleUser.email
      );

      // Link Google account
      if (user) {
        user = await authRepository.updateGoogle(
          user.id,
          googleUser.googleId
        );
      }
    }

    // 3. Create new user
    if (!user) {
      user = await authRepository.createUser({
        mobile: '', 
        countryCode: "+91",

        firstName: googleUser.firstName,
        lastName: googleUser.lastName,

        email: googleUser.email,

        profileImage: googleUser.profileImage,

        googleId: googleUser.googleId,

        authProvider: "GOOGLE",

        isEmailVerified: true,

        isProfileCompleted: false,

        isMobileVerified: false,
      });
    }

    const accessToken = generateAccessToken({
      userId: user.id,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      role: user.role,
    });

    return {
      user,
      accessToken,
      refreshToken,
    };
  }
}

export default new GoogleLoginService();