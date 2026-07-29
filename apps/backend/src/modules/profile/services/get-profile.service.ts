import { AppError } from "../../../helpers/AppError";
import profileRepository from "../repositories/profile.repository";

class GetProfileService {
  async execute(userId: string) {
    const user = await profileRepository.getProfile(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  }
}

export default new GetProfileService();