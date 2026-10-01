import { Request, Response } from "express";

import { asyncHandler } from "../../../helpers/asyncHandler";
import { ApiResponseHelper } from "../../../helpers/api-response";

import bookingSummaryService from "../services/booking-summary.service";

class BookingSummaryController {

  summary = asyncHandler(async (req: Request, res: Response) => {

    const { packageId } = req.body;

    const result =
      await bookingSummaryService.execute(
        req.user!.userId,
        packageId
      );

    return ApiResponseHelper.success(
      res,
      result,
      "Booking summary fetched successfully"
    );

  });

}

export default new BookingSummaryController();