import bookingRepository from "../repositories/booking.repository";

class BookingHistoryService {

  async execute(userId: string) {

    const bookings =
      await bookingRepository.getBookingHistory(
        userId
      );

    return bookings;

  }

}

export default new BookingHistoryService();