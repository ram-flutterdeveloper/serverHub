import sequelize from "../../../../database/sequelize";
import { AppError } from "../../../../helpers/AppError";
import { BookingStatus } from "../../../../constants/booking-status";

import acceptBookingRepository from "../repositories/accept-booking.repository";
import providerRepository from "../../repositories/provider.repository";
import notificationEventService from "../../../notifications/services/notification-event.service";

class AcceptBookingService {

  async getAssignedBookings(userId: string) {

    const provider =
      await providerRepository.findByUserId(userId);

    if (!provider) {
      throw new AppError(
        "Provider not found",
        404
      );
    }

    return acceptBookingRepository.getAssignedBookings(
      provider.id
    );
  }

  async execute(
    bookingId: string,
    userId: string
  ) {

    const transaction =
      await sequelize.transaction();

    try {

      /*
      |--------------------------------------------------------------------------
      | Find Provider From Logged-in User
      |--------------------------------------------------------------------------
      */

      const provider =
        await providerRepository.findByUserId(
          userId
        );

      if (!provider) {

        throw new AppError(
          "Provider not found",
          404
        );

      }

      /*
      |--------------------------------------------------------------------------
      | Find Assigned Booking
      |--------------------------------------------------------------------------
      */

      const booking =
        await acceptBookingRepository.findBooking(
          bookingId,
          provider.id
        );

      if (!booking) {

        throw new AppError(
          "Booking not found or not assigned to you",
          404
        );

      }

      /*
      |--------------------------------------------------------------------------
      | Check Status
      |--------------------------------------------------------------------------
      */

      if (
        booking.status !==
        BookingStatus.PROVIDER_ASSIGNED
      ) {

        throw new AppError(
          "Booking is not available for acceptance",
          400
        );

      }

      /*
      |--------------------------------------------------------------------------
      | Check Assignment Expiry
      |--------------------------------------------------------------------------
      */

      if (
        booking.assignmentExpiresAt &&
        new Date() >
        new Date(booking.assignmentExpiresAt)
      ) {

        throw new AppError(
          "Booking assignment has expired",
          400
        );

      }

      /*
      |--------------------------------------------------------------------------
      | Accept Booking
      |--------------------------------------------------------------------------
      */

      const updatedBooking =
        await acceptBookingRepository.updateBooking(
          booking.id,
          {
            status:
              BookingStatus.PROVIDER_ACCEPTED,

            acceptedAt: new Date(),
          },
          transaction
        );

      /*
      |--------------------------------------------------------------------------
      | Status Log
      |--------------------------------------------------------------------------
      */

      await acceptBookingRepository.createStatusLog(
        booking.id,

        BookingStatus.PROVIDER_ACCEPTED,

        "Provider accepted the booking",

        transaction
      );

      await transaction.commit();

      await notificationEventService.bookingAccepted({

        // Admin who assigned this provider
        adminUserId:
          booking.assignedBy!,

        // Customer who created the booking
        customerUserId:
          booking.userId,

        // Booking ID
        bookingId:
          booking.id,

        // Booking number
        bookingNumber:
          booking.bookingNumber,

      });

      return updatedBooking;

    } catch (error) {

      await transaction.rollback();

      throw error;

    }

  }

  async reject(
    bookingId: string,
    userId: string,
    reason: string
  ) {

    const transaction =
      await sequelize.transaction();

    try {

      /*
      |--------------------------------------------------------------------------
      | Validation
      |--------------------------------------------------------------------------
      */

      if (!reason || !reason.trim()) {

        throw new AppError(
          "Rejection reason is required",
          400
        );

      }


      /*
      |--------------------------------------------------------------------------
      | Find Provider From Logged-in User
      |--------------------------------------------------------------------------
      */

      const provider =
        await providerRepository.findByUserId(
          userId
        );

      if (!provider) {

        throw new AppError(
          "Provider not found",
          404
        );

      }


      /*
      |--------------------------------------------------------------------------
      | Find Assigned Booking
      |--------------------------------------------------------------------------
      */

      const booking =
        await acceptBookingRepository.findBooking(
          bookingId,
          provider.id
        );

      if (!booking) {

        throw new AppError(
          "Booking not found or not assigned to you",
          404
        );

      }


      /*
      |--------------------------------------------------------------------------
      | Check Booking Status
      |--------------------------------------------------------------------------
      */

      if (
        booking.status !==
        BookingStatus.PROVIDER_ASSIGNED
      ) {

        throw new AppError(
          "Booking is not available for rejection",
          400
        );

      }


      /*
      |--------------------------------------------------------------------------
      | Check Assignment Expiry
      |--------------------------------------------------------------------------
      */

      if (
        booking.assignmentExpiresAt &&
        new Date() >
        new Date(booking.assignmentExpiresAt)
      ) {

        throw new AppError(
          "Booking assignment has expired",
          400
        );

      }


      /*
      |--------------------------------------------------------------------------
      | Reject Booking
      |--------------------------------------------------------------------------
      */

      const updatedBooking =
        await acceptBookingRepository.updateBooking(
          booking.id,
          {
            providerId: null,

            status:
              BookingStatus.PROVIDER_REJECTED,

            rejectedAt: new Date(),

            rejectionReason:
              reason.trim(),
          },
          transaction
        );


      /*
      |--------------------------------------------------------------------------
      | Status Log
      |--------------------------------------------------------------------------
      */

      await acceptBookingRepository.createStatusLog(

        booking.id,

        BookingStatus.PROVIDER_REJECTED,

        `Provider rejected booking. Reason: ${reason.trim()}`,

        transaction

      );


      /*
      |--------------------------------------------------------------------------
      | Commit
      |--------------------------------------------------------------------------
      */

      await transaction.commit();


      return updatedBooking;

    } catch (error) {

      await transaction.rollback();

      throw error;

    }

  }
  async getCurrentBooking(userId: string) {

    const provider =
      await providerRepository.findByUserId(
        userId
      );

    if (!provider) {
      throw new AppError(
        "Provider not found",
        404
      );
    }

    const booking =
      await acceptBookingRepository
        .getCurrentBooking(
          provider.id
        );

    return booking;
  }

  async getBookingHistory(
    userId: string,
    page: number,
    limit: number
  ) {

    const provider =
      await providerRepository.findByUserId(
        userId
      );

    if (!provider) {

      throw new AppError(
        "Provider not found",
        404
      );

    }

    return acceptBookingRepository
      .getBookingHistory(
        provider.id,
        page,
        limit
      );

  }

  async start(
    bookingId: string,
    userId: string
  ) {
    const transaction =
      await sequelize.transaction();

    try {

      // Get provider from logged-in user
      const provider =
        await providerRepository.findByUserId(
          userId
        );

      if (!provider) {
        throw new AppError(
          "Provider not found",
          404
        );
      }

      // Find booking
      const booking =
        await acceptBookingRepository.findBooking(
          bookingId,
          provider.id
        );

      if (!booking) {
        throw new AppError(
          "Booking not found",
          404
        );
      }

      // Booking must be accepted first
      if (
        booking.status !==
        BookingStatus.PROVIDER_ACCEPTED
      ) {
        throw new AppError(
          "Booking must be accepted before starting",
          400
        );
      }

      // Update status
      const updatedBooking =
        await acceptBookingRepository.startBooking(
          bookingId,
          provider.id,
          transaction
        );

      // Status log
      await acceptBookingRepository.createStatusLog(
        bookingId,
        BookingStatus.ON_THE_WAY,
        "Provider started journey to customer",
        transaction
      );

      await transaction.commit();


      await notificationEventService.providerOnTheWay({

        /*
        |--------------------------------------------------------------------------
        | Admin
        |--------------------------------------------------------------------------
        */

        adminUserId:
          booking.assignedBy!,

        /*
        |--------------------------------------------------------------------------
        | Customer
        |--------------------------------------------------------------------------
        */

        customerUserId:
          booking.userId,

        /*
        |--------------------------------------------------------------------------
        | Booking ID
        |--------------------------------------------------------------------------
        */

        bookingId:
          booking.id,

        /*
        |--------------------------------------------------------------------------
        | Booking Number
        |--------------------------------------------------------------------------
        */

        bookingNumber:
          booking.bookingNumber,

      });

      return updatedBooking;

    } catch (error) {

      await transaction.rollback();

      throw error;
    }
  }

  async arrive(
    bookingId: string,
    userId: string,
    otp: string
  ) {
    const transaction =
      await sequelize.transaction();

    try {

      // Get provider
      const provider =
        await providerRepository.findByUserId(
          userId
        );

      if (!provider) {
        throw new AppError(
          "Provider not found",
          404
        );
      }

      // Find booking
      const booking =
        await acceptBookingRepository.findBooking(
          bookingId,
          provider.id
        );

      if (!booking) {
        throw new AppError(
          "Booking not found",
          404
        );
      }

      // Must be ON_THE_WAY
      if (
        booking.status !==
        BookingStatus.ON_THE_WAY
      ) {
        throw new AppError(
          "Provider must be on the way before arriving",
          400
        );
      }

      // Validate OTP
      if (!booking.arrivalOtp) {
        throw new AppError(
          "Arrival OTP is not available",
          400
        );
      }

      if (
        booking.arrivalOtp !== otp
      ) {
        throw new AppError(
          "Invalid OTP",
          400
        );
      }

      // Update booking
      const updatedBooking =
        await acceptBookingRepository.arriveBooking(
          bookingId,
          provider.id,
          transaction
        );

      // Status log
      await acceptBookingRepository.createStatusLog(
        bookingId,
        BookingStatus.ARRIVED,
        "Provider arrived and OTP was verified",
        transaction
      );

      await transaction.commit();

      await notificationEventService.providerArrived({

        customerUserId:
          booking.userId,

        bookingId:
          booking.id,

        bookingNumber:
          booking.bookingNumber,

      });

      return updatedBooking;

    } catch (error) {

      await transaction.rollback();

      throw error;
    }
  }


  async complete(
    bookingId: string,
    userId: string,
    files?: Express.Multer.File[]
  ) {

    const transaction =
      await sequelize.transaction();

    try {

      // Get provider
      const provider =
        await providerRepository.findByUserId(
          userId
        );

      if (!provider) {
        throw new AppError(
          "Provider not found",
          404
        );
      }

      // Find booking
      const booking =
        await acceptBookingRepository.findBooking(
          bookingId,
          provider.id
        );

      if (!booking) {
        throw new AppError(
          "Booking not found",
          404
        );
      }

      // Booking must be ARRIVED
      if (
        booking.status !==
        BookingStatus.ARRIVED
      ) {
        throw new AppError(
          "Booking must be in ARRIVED status before completing",
          400
        );
      }

      // Save uploaded media
      if (files && files.length > 0) {

        for (const file of files) {

          const type =
            file.mimetype.startsWith("video/")
              ? "VIDEO"
              : "IMAGE";

          /*
           * file.path / file.location
           *
           * Depends on your upload storage.
           *
           * If Cloudinary/S3 is used,
           * use the returned secure URL here.
           */

          const url =
            (file as any).location ||
            file.path;

          if (!url) {
            throw new AppError(
              "Uploaded file URL not found",
              400
            );
          }

          await acceptBookingRepository
            .addBookingMedia(
              {
                bookingId,
                type,
                url,
              },
              transaction
            );
        }
      }

      // Complete booking
      const updatedBooking =
        await acceptBookingRepository
          .completeBooking(
            bookingId,
            provider.id,
            transaction
          );

      // Status log
      await acceptBookingRepository
        .createStatusLog(
          bookingId,
          BookingStatus.COMPLETED,
          "Provider completed the service",
          transaction
        );

      await transaction.commit();

      await notificationEventService.serviceCompleted({

        adminUserId:
          booking.assignedBy!,

        customerUserId:
          booking.userId,

        bookingId:
          booking.id,

        bookingNumber:
          booking.bookingNumber,

      });



      return updatedBooking;

    } catch (error) {

      await transaction.rollback();

      throw error;
    }
  }
}

export default new AcceptBookingService();