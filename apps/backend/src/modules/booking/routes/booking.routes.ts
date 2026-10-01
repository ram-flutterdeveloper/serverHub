import { Router } from "express";

import { authMiddleware } from "../../../middlewares/auth.middleware";

import bookingSummaryController from "../controllers/booking-summary.controller";
import bookingController from "../controllers/booking.controller";

import { bookingSummaryValidator } from "../validators/booking-summary.validator";
import { createBookingValidator } from "../validators/create-booking.validator";

const router = Router();

/*
|--------------------------------------------------------------------------
| Booking Summary
|--------------------------------------------------------------------------
*/

router.post(
  "/summary",
  authMiddleware,
  bookingSummaryValidator,
  bookingSummaryController.summary
);

/*
|--------------------------------------------------------------------------
| Create Booking
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authMiddleware,
  createBookingValidator,
  bookingController.create
);

/*
|--------------------------------------------------------------------------
| Booking History
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authMiddleware,
  bookingController.history
);


/*
|--------------------------------------------------------------------------
| Booking Details
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  authMiddleware,
  bookingController.details
);

/*
|--------------------------------------------------------------------------
| Cancel Booking
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/cancel",
  authMiddleware,
  bookingController.cancel
);

export default router;