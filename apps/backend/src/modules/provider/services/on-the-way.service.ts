import { AppError } from "../../../helpers/AppError";
import { BookingStatus } from "../../../constants/booking-status";
import bookingActionRepository from "../repositories/booking-action.repository";

class OnTheWayService {
  async execute(
    bookingId: string,
    providerId: string
  ) {
    /*
    |--------------------------------------------------------------------------
    | Get Booking
    |--------------------------------------------------------------------------
    */

    const booking =
      await bookingActionRepository.findBooking(
        bookingId
      );

    if (!booking) {
      throw new AppError(
        "Booking not found",
        404
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Provider Validation
    |--------------------------------------------------------------------------
    */

    if (!booking.providerId) {
      throw new AppError(
        "No provider assigned to this booking",
        400
      );
    }

    if (booking.providerId !== providerId) {
      throw new AppError(
        "You are not assigned to this booking",
        403
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Booking Status Validation
    |--------------------------------------------------------------------------
    */

    if (
      booking.status !==
      BookingStatus.PROVIDER_ACCEPTED
    ) {
      throw new AppError(
        "Booking must be accepted before going on the way",
        400
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Update Status
    |--------------------------------------------------------------------------
    */

    const updatedBooking =
      await bookingActionRepository.updateStatus(
        booking.id,
        BookingStatus.ON_THE_WAY
      );

    /*
    |--------------------------------------------------------------------------
    | Status Log
    |--------------------------------------------------------------------------
    */

    await bookingActionRepository.createStatusLog(
      booking.id,
      BookingStatus.ON_THE_WAY,
      "Provider is on the way"
    );

    return updatedBooking;
  }
}

export default new OnTheWayService();