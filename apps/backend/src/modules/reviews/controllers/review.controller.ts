import { Request, Response } from "express";

import { asyncHandler }
  from "../../../helpers/asyncHandler";
import createReviewService from "../services/create-review.service";
import { ApiResponseHelper } from "../../../helpers/api-response";
import packageReviewsService from "../services/package-reviews.service";
import providerReviewsService from "../services/provider-reviews.service";
import adminReviewService from "../services/admin-review.service";



class ReviewController {


  create = asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      const result =
        await createReviewService.execute({

          userId:
            req.user!.userId,

          bookingId:
            req.body.bookingId,

          rating:
            req.body.rating,

          review:
            req.body.review,

          images:
            req.body.images,

        });


      return ApiResponseHelper.success(
        res,
        result,
        "Review created successfully"
      );
    }
  );


  // ==========================================
  // USER - PACKAGE REVIEWS
  // ==========================================
  packageReviews = asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      const page =
        Number(req.query.page ?? 1);

      const limit =
        Number(req.query.limit ?? 10);


      const result =
        await packageReviewsService.execute(

          req.params.packageId as string,

          page,

          limit

        );


      return ApiResponseHelper.success(
        res,
        result,
        "Package reviews fetched successfully"
      );

    }
  );


  // ==========================================
  // PROVIDER - MY REVIEWS
  // ==========================================

  providerReviews = asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      const result =
        await providerReviewsService.execute(

          req.user!.userId

        );


      return ApiResponseHelper.success(
        res,
        result,
        "Provider reviews fetched successfully"
      );
    }
  );


  // ==========================================
  // ADMIN - GET ALL
  // ==========================================

  adminGetAll = asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      const result =
        await adminReviewService.getAll();


      return ApiResponseHelper.success(
        res,
        result,
        "Reviews fetched successfully"
      );
    }
  );


  // ==========================================
  // ADMIN - CREATE
  // ==========================================

  adminCreate = asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      const result =
        await adminReviewService.create(
          req.body
        );


      return ApiResponseHelper.success(
        res,
        result,
        "Review created successfully"
      );
    }
  );


  // ==========================================
  // ADMIN - UPDATE
  // ==========================================

  adminUpdate = asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      const result =
        await adminReviewService.update(

          req.params.id as string,

          req.body

        );


      return ApiResponseHelper.success(
        res,
        result,
        "Review updated successfully"
      );
    }
  );


  // ==========================================
  // ADMIN - DELETE
  // ==========================================

  adminDelete = asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      const result =
        await adminReviewService.delete(

          req.params.id as string

        );


      return ApiResponseHelper.success(
        res,
        result,
        "Review deleted successfully"
      );
    }
  );
}

export default new ReviewController();