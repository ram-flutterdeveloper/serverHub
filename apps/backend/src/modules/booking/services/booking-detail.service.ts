import bookingRepository from "../repositories/booking.repository";
import { AppError } from "../../../helpers/AppError";

class BookingDetailService {

    async execute(
        bookingId: string,
        userId: string
    ) {

        const booking =
            await bookingRepository.getBookingById(
                bookingId,
                userId
            );

        if (!booking) {
            throw new AppError(
                "Booking not found",
                404
            );
        }

        return booking;

    }

}

export default new BookingDetailService();