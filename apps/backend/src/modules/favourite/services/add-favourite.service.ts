
import favouriteRepository from "../repositories/favourite.repository";

import { Package } from "../../master-data/models";
import { AppError } from "../../../helpers/AppError";

class AddFavouriteService {

  async execute(
    userId: string,
    packageId: string
  ) {

    // ==========================================
    // 1. CHECK PACKAGE
    // ==========================================

    const packageData =
      await Package.findByPk(packageId);

    if (!packageData) {
      throw new AppError(
        "Package not found",
        404
      );
    }


    // ==========================================
    // 2. CHECK PACKAGE STATUS
    // ==========================================

    if (packageData.status !== "ACTIVE") {
      throw new AppError(
        "This package is not available",
        400
      );
    }


    // ==========================================
    // 3. CHECK EXISTING FAVOURITE
    // ==========================================

    const existingFavourite =
      await favouriteRepository.findByUserAndPackage(
        userId,
        packageId
      );

    if (existingFavourite) {
      throw new AppError(
        "Package is already in your favourites",
        400
      );
    }


    // ==========================================
    // 4. CREATE FAVOURITE
    // ==========================================

    const favourite =
      await favouriteRepository.create(
        userId,
        packageId
      );


    // ==========================================
    // 5. RETURN RESULT
    // ==========================================

    return favourite;
  }

}

export default new AddFavouriteService();