import profileRepository from "../repositories/profile.repository";

class UpdateProfileService {
  async execute(userId: string, body: any) {
    const profile = await profileRepository.updateProfile(userId, {
      ...body,
      isProfileCompleted: true,
    });

    return profile;
  }
}

export default new UpdateProfileService();