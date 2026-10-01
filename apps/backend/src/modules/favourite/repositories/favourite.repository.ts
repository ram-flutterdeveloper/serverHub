import Favourite from "../models/favourite.model";

import { Package } from "../../master-data/models";

class FavouriteRepository {

  // ==========================================
  // CREATE FAVOURITE
  // ==========================================

  async create(
    userId: string,
    packageId: string
  ) {
    return Favourite.create({
      userId,
      packageId,
    });
  }


  // ==========================================
  // FIND FAVOURITE
  // ==========================================
  //
  // Used to check whether the user has already
  // favourited this package.
  //

  async findByUserAndPackage(
    userId: string,
    packageId: string
  ) {
    return Favourite.findOne({
      where: {
        userId,
        packageId,
      },
    });
  }


  // ==========================================
  // DELETE FAVOURITE
  // ==========================================

  async deleteByUserAndPackage(
    userId: string,
    packageId: string
  ) {
    return Favourite.destroy({
      where: {
        userId,
        packageId,
      },
    });
  }


  // ==========================================
  // GET USER FAVOURITES
  // ==========================================

  async findByUserId(
    userId: string
  ) {
    return Favourite.findAll({
      where: {
        userId,
      },

      include: [
        {
          model: Package,
          as: "package",
        },
      ],

      order: [
        ["createdAt", "DESC"],
      ],
    });
  }


  // ==========================================
  // GET FAVOURITES WITH PAGINATION
  // ==========================================

  async findByUserIdPaginated(
    userId: string,
    limit: number,
    offset: number
  ) {
    return Favourite.findAndCountAll({
      where: {
        userId,
      },

      include: [
        {
          model: Package,
          as: "package",
        },
      ],

      order: [
        ["createdAt", "DESC"],
      ],

      limit,
      offset,
    });
  }

}

export default new FavouriteRepository();