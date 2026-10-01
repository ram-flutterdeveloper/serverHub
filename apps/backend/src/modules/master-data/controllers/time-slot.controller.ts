import {
  Request,
  Response
} from "express";



import {
  asyncHandler
} from "../../../helpers/asyncHandler";

import {
  ApiResponseHelper
} from "../../../helpers/api-response";
import timeSlotService from "../services/time-slot.service";


class TimeSlotController {

  // ==========================================
  // ADD MULTIPLE TIME SLOTS
  // ==========================================

  createMany = asyncHandler(

    async (
      req: Request,
      res: Response
    ) => {

      const {
        timeSlots
      } = req.body;


      const result =
        await timeSlotService.createMany(
          timeSlots
        );


      return ApiResponseHelper.success(
        res,
        result,
        "Time slots created successfully"
      );

    }

  );


  // ==========================================
  // GET ALL TIME SLOTS
  // ==========================================

  getAll = asyncHandler(

    async (
      _req: Request,
      res: Response
    ) => {

      const result =
        await timeSlotService.getAll();


      return ApiResponseHelper.success(
        res,
        result,
        "Time slots fetched successfully"
      );

    }

  );

}


export default new TimeSlotController();