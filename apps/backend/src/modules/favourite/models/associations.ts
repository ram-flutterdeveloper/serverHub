import Favourite from "./favourite.model";

import { User } from "../../auth/models";

import { Package } from "../../master-data/models";

export const initializeFavouriteAssociations = () => {

  // ==========================================
  // FAVOURITE → USER
  // ==========================================

  Favourite.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
  });


  // ==========================================
  // FAVOURITE → PACKAGE
  // ==========================================

  Favourite.belongsTo(Package, {
    foreignKey: "packageId",
    as: "package",
  });


  // ==========================================
  // USER → FAVOURITES
  // ==========================================

  User.hasMany(Favourite, {
    foreignKey: "userId",
    as: "favourites",
  });


  // ==========================================
  // PACKAGE → FAVOURITES
  // ==========================================

  Package.hasMany(Favourite, {
    foreignKey: "packageId",
    as: "favourites",
  });

};