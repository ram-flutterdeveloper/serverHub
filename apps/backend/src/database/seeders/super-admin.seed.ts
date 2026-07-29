import { UserRole } from "../../constants/user-role";
import { User } from "../../modules/auth/models";


class SuperAdminSeeder {
  async run() {
    try {
      const mobile = "9999999999";

      const existingAdmin = await User.findOne({
        where: {
          mobile,
        },
      });

      if (existingAdmin) {
        console.log("✅ Super Admin already exists");
        return;
      }

      await User.create({
        firstName: "Super",
        lastName: "Admin",

        mobile: mobile,

        countryCode: "+91",

        email: "admin@servicehub.com",

        role: UserRole.ADMIN,

        status: "ACTIVE",

        isMobileVerified: true,

        isProfileCompleted: true,

        authProvider: "OTP",

        isEmailVerified: true,
      });

      console.log("✅ Super Admin created successfully");
    } catch (error) {
      console.error("❌ Super Admin Seeder Error:", error);
    }
  }
}

export default new SuperAdminSeeder();