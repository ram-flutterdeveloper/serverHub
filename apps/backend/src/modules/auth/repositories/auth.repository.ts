import { OtpVerification, User } from "../models";

class AuthRepository {

  async findUserByMobile(mobile: string) {
    return User.findOne({
      where: { mobile },
    });
  }

  async createUser(data: Partial<User>) {
    return User.create(data as any);
  }

  // async updateUser(id: string, data: Partial<User>) {
  //   return User.update(data, {
  //     where: { id },
  //   });
  // }
  async updateUser(id: string, data: Partial<User>) {
    await User.update(data, {
      where: { id },
    });

    return User.findByPk(id);
  }


  async saveOtp(data: Partial<OtpVerification>) {
    return OtpVerification.create(data as any);
  }

  async findLatestOtp(mobile: string) {
    return OtpVerification.findOne({
      where: {
        mobile,
      },
      order: [["createdAt", "DESC"]],
    });
  }

  async markOtpVerified(id: string) {
    return OtpVerification.update(
      {
        verifiedAt: new Date(),
      },
      {
        where: { id },
      }
    );
  }

  async deleteOldOtps(mobile: string) {
    return OtpVerification.destroy({
      where: { mobile },
    });
  }

  async findByGoogleId(googleId: string) {
    return User.findOne({
      where: {
        googleId,
      },
    });
  }

  async findByEmail(email: string) {
    return User.findOne({
      where: {
        email,
      },
    });
  }

  async updateGoogle(
    id: string,
    googleId: string
  ) {
    await User.update(
      {
        googleId,
        authProvider: "GOOGLE",
        isEmailVerified: true,
      },
      {
        where: {
          id,
        },
      }
    );

    return User.findByPk(id);
  }




}

export default new AuthRepository();