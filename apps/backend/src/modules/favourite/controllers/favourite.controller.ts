import { Request, Response } from "express";

import { asyncHandler } from "../../../helpers/asyncHandler";
import { ApiResponseHelper } from "../../../helpers/api-response";

import addFavouriteService from "../services/add-favourite.service";
import removeFavouriteService from "../services/remove-favourite.service";
import getFavouritesService from "../services/get-favourites.service";

class FavouriteController {

    // ==========================================
    // ADD FAVOURITE
    // ==========================================

    addFavourite = asyncHandler(
        async (req: Request, res: Response) => {

            const userId =
                (req as any).user.userId;

            const { packageId } =
                req.params;

            const favourite =
                await addFavouriteService.execute(
                    userId,
                    packageId as string
                );

            return ApiResponseHelper.success(
                res,
                favourite,
                "Package added to favourites successfully"
            );
        }
    );


    // ==========================================
    // REMOVE FAVOURITE
    // ==========================================

    removeFavourite = asyncHandler(
        async (req: Request, res: Response) => {

            const userId =
                (req as any).user.userId;

            const { packageId } =
                req.params;

            await removeFavouriteService.execute(
                userId,
                packageId as string 
            );

            return ApiResponseHelper.success(
                res,
                null,
                "Package removed from favourites successfully"
            );
        }
    );


    // ==========================================
    // GET FAVOURITES
    // ==========================================

    getFavourites = asyncHandler(
        async (req: Request, res: Response) => {

            const userId =
                (req as any).user.userId;

            const page =
                Number(req.query.page) || 1;

            const limit =
                Number(req.query.limit) || 10;

            const favourites =
                await getFavouritesService.execute(
                    userId,
                    page,
                    limit
                );

            return ApiResponseHelper.success(
                res,
                favourites,
                "Favourites fetched successfully"
            );
        }
    );

}

export default new FavouriteController();