import { BookingStatus } from "../../../../constants/booking-status";
import { AppError } from "../../../../helpers/AppError";
import bookingRepository from "../../../booking/repositories/booking.repository";
import notificationEventService from "../../../notifications/services/notification-event.service";
import providerRepository from "../../../provider/repositories/provider.repository";

class AssignProviderService {

  async execute(
    bookingId: string,
    providerId: string,
    adminId: string
  ) {

    // 1 Booking
    const booking =
      await bookingRepository.findById(bookingId);

    if (!booking)
      throw new AppError("Booking not found", 404);

    // 2 Status Check
    if (booking.status !== BookingStatus.PENDING) {
      throw new AppError(
        "Booking cannot be assigned",
        400
      );
    }

    // 3 Provider
    const provider =
      await providerRepository.findById(providerId);

    if (!provider)
      throw new AppError(
        "Provider not found",
        404
      );

    // 4 Update Booking
    await bookingRepository.updateBooking(
      bookingId,
      {
        providerId,

        assignedBy: adminId,

        assignedAt: new Date(),

        assignmentExpiresAt: new Date(
          Date.now() + 5 * 60 * 1000
        ),

        status:
          BookingStatus.PROVIDER_ASSIGNED,
      }
    );

    // 5 Status Log
    await bookingRepository.addStatusLog(
      bookingId,
      BookingStatus.PROVIDER_ASSIGNED,
      "Provider Assigned"
    );

    await notificationEventService.bookingAssigned({

      // Provider's USER ID
      providerUserId:
        provider.userId,

      // Customer's USER ID
      customerUserId:
        booking.userId,

      // Booking reference
      bookingId:
        booking.id,

      // Booking number for message
      bookingNumber:
        booking.bookingNumber,

    });


    // 6 TODO
    // Send Push Notification

    return bookingRepository.findById(
      bookingId
    );

  }

}

export default new AssignProviderService();