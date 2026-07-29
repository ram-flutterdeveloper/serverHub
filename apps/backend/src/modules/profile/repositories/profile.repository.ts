import { User } from "../../auth/models";

class ProfileRepository {
  async getProfile(userId: string) {
    return User.findByPk(userId, {
      attributes: {
        exclude: ["deletedAt"],
      },
    });
  }

  async updateProfile(userId: string, data: Partial<User>) {
    await User.update(data, {
      where: {
        id: userId,
      },
    });

    return this.getProfile(userId);
  }
}

export default new ProfileRepository();