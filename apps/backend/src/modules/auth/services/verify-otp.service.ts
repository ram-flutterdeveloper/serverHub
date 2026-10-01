import authRepository from "../repositories/auth.repository";
import { AppError } from "../../../helpers/AppError";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../../helpers/jwt";

class VerifyOtpService {
  async execute(
    mobile: string,
    otp: string
  ) {
    // =====================================================
    // 1. Find latest OTP
    // =====================================================

    const otpRecord =
      await authRepository.findLatestOtp(mobile);

    if (!otpRecord) {
      throw new AppError(
        "OTP not found",
        400
      );
    }

    // =====================================================
    // 2. Already verified
    // =====================================================

    if (otpRecord.verifiedAt) {
      throw new AppError(
        "OTP already verified",
        400
      );
    }

    // =====================================================
    // 3. OTP expired
    // =====================================================

    if (
      new Date() >
      otpRecord.expiresAt
    ) {
      throw new AppError(
        "OTP expired",
        400
      );
    }

    // =====================================================
    // 4. OTP validation
    // =====================================================

    if (
      otpRecord.otp !== otp
    ) {
      throw new AppError(
        "Invalid OTP",
        400
      );
    }

    // =====================================================
    // 5. Mark OTP verified
    // =====================================================

    await authRepository.markOtpVerified(
      otpRecord.id
    );

    // =====================================================
    // 6. Find existing user
    // =====================================================

    let user =
      await authRepository.findUserByMobile(
        mobile
      );

    // =====================================================
    // 7. Create customer if user doesn't exist
    // =====================================================

    if (!user) {

      user =
        await authRepository.createUser({
          mobile,
          countryCode: "+91",
          isMobileVerified: true,
          isProfileCompleted: false,
        });

    }

    // =====================================================
    // 8. BLOCKED USER CHECK
    // =====================================================

    if (
      user.status === "BLOCKED"
    ) {

      throw new AppError(
        "Your account has been blocked. Please contact administrator.",
        403
      );

    }

    // =====================================================
    // 9. Make sure mobile is verified
    // =====================================================

    if (
      !user.isMobileVerified
    ) {

      user =
        await authRepository.updateUser(
          user.id,
          {
            isMobileVerified: true,
          }
        );

    }

    // =====================================================
    // 10. Provider details
    //
    // IMPORTANT:
    // Do NOT block PENDING provider here.
    // =====================================================

    let provider = null;

    if (
      user!.role === "PROVIDER"
    ) {

      provider =  await authRepository
          .findProviderByUserId(
            user!.id
          );

      if (!provider) {

        throw new AppError(
          "Provider profile not found.",
          404
        );

      }

    }

    // =====================================================
    // 11. Generate token
    // =====================================================

    const payload = {
      userId: user!.id,
      mobile: user!.mobile,
      role: user!.role,
    };

    const accessToken =
      generateAccessToken(
        payload
      );

    const refreshToken =
      generateRefreshToken(
        payload
      );

    // =====================================================
    // 12. Return
    // =====================================================

    return {

      user,

      provider,

      accessToken,

      refreshToken,

    };
  }
}

export default new VerifyOtpService();


// import authRepository from "../repositories/auth.repository";
// import { AppError } from "../../../helpers/AppError";
// import {
//   generateAccessToken,
//   generateRefreshToken,
// } from "../../../helpers/jwt";

// class VerifyOtpService {
//   async execute(mobile: string, otp: string) {
//     // Find latest OTP
//     const otpRecord = await authRepository.findLatestOtp(mobile);

//     if (!otpRecord) {
//       throw new AppError("OTP not found", 400);
//     }

//     if (otpRecord.verifiedAt) {
//       throw new AppError("OTP already verified", 400);
//     }

//     if (new Date() > otpRecord.expiresAt) {
//       throw new AppError("OTP expired", 400);
//     }

//     if (otpRecord.otp !== otp) {
//       throw new AppError("Invalid OTP", 400);
//     }

//     await authRepository.markOtpVerified(otpRecord.id);

//     // Find user
//     let user = await authRepository.findUserByMobile(mobile);

//     // Create new customer if user doesn't exist
//     if (!user) {
//       user = await authRepository.createUser({
//         mobile,
//         countryCode: "+91",
//         isMobileVerified: true,
//         isProfileCompleted: false,
//       });
//     }

//     // ===============================
//     // USER STATUS CHECK
//     // ===============================
//     if (user.status === "BLOCKED") {
//       throw new AppError(
//         "Your account has been blocked. Please contact administrator.6393100157",
//         403
//       );
//     }

//     // ===============================
//     // PROVIDER STATUS CHECK
//     // ===============================
//     if (user.role === "PROVIDER") {
//       const provider = await authRepository.findProviderByUserId(user.id);

//       if (!provider) {
//         throw new AppError("Provider profile not found.", 404);
//       }

//       switch (provider.status) {
//         case "PENDING":
//           throw new AppError(
//             "Your account is waiting for admin approval.",
//             403
//           );

//         case "REJECTED":
//           throw new AppError(
//             "Your provider account has been rejected.",
//             403
//           );

//         case "SUSPENDED":
//           throw new AppError(
//             "Your provider account has been suspended.",
//             403
//           );
//       }
//     }

//     // ===============================
//     // Generate Tokens
//     // ===============================
//     const payload = {
//       userId: user.id,
//       mobile: user.mobile,
//       role: user.role,
//     };

//     const accessToken = generateAccessToken(payload);

//     const refreshToken = generateRefreshToken(payload);

//     return {
//       user,
//       accessToken,
//       refreshToken,
//     };
//   }
// }

// export default new VerifyOtpService();


// // import authRepository from "../repositories/auth.repository";
// // import { AppError } from "../../../helpers/AppError";
// // import {
// //   generateAccessToken,
// //   generateRefreshToken,
// // } from "../../../helpers/jwt";

// // class VerifyOtpService {
// //   async execute(mobile: string, otp: string) {
// //     const otpRecord = await authRepository.findLatestOtp(mobile);

// //     if (!otpRecord) {
// //       throw new AppError("OTP not found", 400);
// //     }

// //     if (otpRecord.verifiedAt) {
// //       throw new AppError("OTP already verified", 400);
// //     }

// //     if (new Date() > otpRecord.expiresAt) {
// //       throw new AppError("OTP expired", 400);
// //     }

// //     if (otpRecord.otp !== otp) {
// //       throw new AppError("Invalid OTP", 400);
// //     }

// //     await authRepository.markOtpVerified(otpRecord.id);

// //     let user = await authRepository.findUserByMobile(mobile);

// //     if (!user) {
// //       user = await authRepository.createUser({
// //         mobile,
// //         countryCode: "+91",
// //         isMobileVerified: true,
// //         isProfileCompleted: false,
// //       });
// //     }

// //     const payload = {
// //       userId: user.id,
// //       mobile: user.mobile,
// //       role: user.role,
// //     };

// //     const accessToken = generateAccessToken(payload);

// //     const refreshToken = generateRefreshToken(payload);

// //     return {
// //       user,
// //       accessToken,
// //       refreshToken,
// //     };
// //   }
// // }

// // export default new VerifyOtpService();