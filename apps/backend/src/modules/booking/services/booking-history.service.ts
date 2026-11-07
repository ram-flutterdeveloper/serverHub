import bookingRepository from "../repositories/booking.repository";

class BookingHistoryService {
  async execute(
    userId: string,
    page: number,
    limit: number,
    status?: string
  ) {
    const result = await bookingRepository.getBookingHistory(
      userId,
      page,
      limit,
      status
    );

    return {
      bookings: result.bookings,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
        hasNextPage: page * limit < result.total,
        hasPreviousPage: page > 1,
      },
    };
  }
}

export default new BookingHistoryService();