import { AppError } from "../../../../helpers/AppError";
import bookingRepository
    from "../repositories/booking.repository";


class BookingService {

    async dashboard() {

        return bookingRepository.getDashboard();

    }




    async getBookings(query: any) {

        return bookingRepository.getBookings({

            page: Number(query.page) || 1,

            limit: Number(query.limit) || 10,

            search: query.search,

            status: query.status,

            paymentStatus: query.paymentStatus,

            customerId: query.customerId,

            providerId: query.providerId,

            from: query.from,

            to: query.to,

        });

    }

    async getBooking(id: string) {

    const booking =
        await bookingRepository.getBookingDetails(id);

    if (!booking) {

        throw new AppError(
            "Booking not found",
            404
        );

    }

    return booking;

}

}

export default new BookingService();