import sequelize from "../../../database/sequelize";
import { AppError } from "../../../helpers/AppError";

import bookingRepository from "../repositories/booking.repository";

import { BookingStatus } from "../../../constants/booking-status";
import notificationEventService from "../../notifications/services/notification-event.service";


import authRepository from "../../auth/repositories/auth.repository";
class CancelBookingService {

    async execute(
        bookingId: string,
        userId: string
    ) {

        const transaction =
            await sequelize.transaction();

        try {

            const booking =
                await bookingRepository.findBookingById(
                    bookingId
                );

            if (!booking) {
                throw new AppError(
                    "Booking not found",
                    404
                );
            }

            if (booking.userId !== userId) {
                throw new AppError(
                    "Unauthorized",
                    403
                );
            }

            if (
                booking.status === BookingStatus.CANCELLED
            ) {
                throw new AppError(
                    "Booking already cancelled",
                    400
                );
            }

            if (
                booking.status === BookingStatus.ON_THE_WAY ||
                booking.status === BookingStatus.ARRIVED ||
                booking.status === BookingStatus.STARTED ||
                booking.status === BookingStatus.COMPLETED
            ) {
                throw new AppError(
                    "Booking cannot be cancelled now",
                    400
                );
            }

            const result =
                await bookingRepository.cancelBooking(
                    booking.id,
                    transaction
                );

            await bookingRepository.addStatusLog(
                booking.id,
                BookingStatus.CANCELLED,
                "Cancelled by customer",
                transaction
            );

            await transaction.commit();

            const admins =
                await authRepository.findActiveAdmins();

            for (const admin of admins) {

                await notificationEventService.bookingCancelled({
                    adminUserId: admin.id,
                    bookingId: booking.id,
                    bookingNumber: booking.bookingNumber,
                });

            }


            return result;

        } catch (error) {

            await transaction.rollback();

            throw error;

        }

    }

}

export default new CancelBookingService();