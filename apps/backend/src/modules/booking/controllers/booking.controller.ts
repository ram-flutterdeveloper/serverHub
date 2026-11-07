import { Request, Response } from "express";

import { asyncHandler } from "../../../helpers/asyncHandler";
import { ApiResponseHelper } from "../../../helpers/api-response";
import createBookingService from "../services/create-booking.service";
import bookingHistoryService from "../services/booking-history.service";
import bookingDetailService from "../services/booking-detail.service";
import cancelBookingService from "../services/cancel-booking.service";


class BookingController {

  /*
  |--------------------------------------------------------------------------
  | Create Booking
  |--------------------------------------------------------------------------
  */

  create = asyncHandler(async (req: Request, res: Response) => {

    const result = await createBookingService.execute({

      ...req.body,

      userId: req.user!.userId,

    });

    return ApiResponseHelper.success(
      res,
      result,
      "Booking created successfully"
    );

  });

  /*
  |--------------------------------------------------------------------------
  | Booking History
  |--------------------------------------------------------------------------
  */



  // history = asyncHandler(
  //   async (req: Request, res: Response) => {

  //     const bookings =
  //       await bookingHistoryService.execute(
  //         req.user!.userId
  //       );

  //     return ApiResponseHelper.success(
  //       res,
  //       bookings,
  //       "Booking history fetched successfully"
  //     );

  //   }
  // );

  history = asyncHandler(
    async (req: Request, res: Response) => {
      const page = Math.max(
        1,
        Number.parseInt(req.query.page as string, 10) || 1
      );

      const limit = Math.min(
        100,
        Math.max(
          1,
          Number.parseInt(req.query.limit as string, 10) || 10
        )
      );
      const status =
        typeof req.query.status === "string"
          ? req.query.status.trim().toLowerCase()
          : undefined;

      const result = await bookingHistoryService.execute(
        req.user!.userId,
        page,
        limit, 
        status
      );

      return ApiResponseHelper.success(
        res,
        result,
        "Booking history fetched successfully"
      );
    }
  );

  /*
  |--------------------------------------------------------------------------
  | Booking Details
  |--------------------------------------------------------------------------
  */

  details = asyncHandler(async (req: Request, res: Response) => {

    const result =
      await bookingDetailService.execute(

        req.params.id as string,

        req.user!.userId

      );

    return ApiResponseHelper.success(
      res,
      result,
      "Booking details fetched successfully"
    );

  });

  /*
  |--------------------------------------------------------------------------
  | Cancel Booking
  |--------------------------------------------------------------------------
  */

  cancel = asyncHandler(async (req: Request, res: Response) => {

    const result =
      await cancelBookingService.execute(

        req.params.id as string,

        req.user!.userId

      );

    return ApiResponseHelper.success(
      res,
      result,
      "Booking cancelled successfully"
    );

  });



}

export default new BookingController();