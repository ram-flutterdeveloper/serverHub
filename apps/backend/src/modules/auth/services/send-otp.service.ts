import authRepository from "../repositories/auth.repository";

class SendOtpService {
    async execute(mobile: string) {
        await authRepository.deleteOldOtps(mobile);

        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        await authRepository.saveOtp({
            mobile,
            otp,
            purpose: "LOGIN",
            expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        });

        // TODO:
        // Integrate SMS provider (MSG91 / Twilio)

        return {
            otp,
            expiresIn: 300,
        };
    }

    
}

export default new SendOtpService();


// import authRepository from "../repositories/auth.repository";

// class SendOtpService {
//   async execute(mobile: string) {
//     // Delete previous OTP
//     await authRepository.deleteOldOtps(mobile);

//     // Generate OTP
//     const otp = Math.floor(
//       100000 + Math.random() * 900000
//     ).toString();

//     // Save OTP
//     await authRepository.saveOtp({
//       mobile,
//       otp,
//       purpose: "LOGIN",
//       expiresAt: new Date(Date.now() + 5 * 60 * 1000),
//     });

//     // TODO:
//     // Send SMS using MSG91/Twilio

//     console.log("OTP:", otp);

//     return true;
//   }
// }

// export default new SendOtpService();