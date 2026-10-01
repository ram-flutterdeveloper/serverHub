import { Router } from "express";

import favouriteController from "../controllers/favourite.controller";

import { authMiddleware } from "../../../middlewares/auth.middleware";

import {
  favouritePackageValidator,
} from "../validators/favourite.validator";

const router = Router();


// ==========================================
// GET FAVOURITES
// ==========================================

router.get(
  "/",
  authMiddleware,
  favouriteController.getFavourites
);


// ==========================================
// ADD FAVOURITE
// ==========================================

router.post(
  "/:packageId",
  authMiddleware,
  favouritePackageValidator,
  favouriteController.addFavourite
);


// ==========================================
// REMOVE FAVOURITE
// ==========================================

router.delete(
  "/:packageId",
  authMiddleware,
  favouritePackageValidator,
  favouriteController.removeFavourite
);


export default router;