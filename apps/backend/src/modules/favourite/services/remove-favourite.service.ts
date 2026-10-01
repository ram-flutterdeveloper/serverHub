

import { AppError } from "../../../helpers/AppError";
import favouriteRepository from "../repositories/favourite.repository";

class RemoveFavouriteService {

  async execute(
    userId: string,
    packageId: string
  ) {

    // ==========================================
    // 1. FIND FAVOURITE
    // ==========================================

    const favourite =
      await favouriteRepository.findByUserAndPackage(
        userId,
        packageId
      );

    // ==========================================
    // 2. FAVOURITE NOT FOUND
    // ==========================================

    if (!favourite) {
      throw new AppError(
        "Package is not in your favourites",
        404
      );
    }

    // ==========================================
    // 3. DELETE FAVOURITE
    // ==========================================

    await favouriteRepository.deleteByUserAndPackage(
      userId,
      packageId
    );

    // ==========================================
    // 4. RETURN
    // ==========================================

    return true;
  }
}

export default new RemoveFavouriteService();