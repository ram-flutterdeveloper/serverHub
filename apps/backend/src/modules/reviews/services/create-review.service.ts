import { BookingStatus } from "../../../constants/booking-status";
import { AppError } from "../../../helpers/AppError";
import bookingRepository from "../../booking/repositories/booking.repository";
import reviewRepository from "../repositories/review.repository";


interface CreateReviewData {

  userId: string;

  bookingId: string;

  rating: number;

  review?: string;

  images?: string[];
}

class CreateReviewService {

  async execute(
    data: CreateReviewData
  ) {

    // ==========================================
    // 1. FIND BOOKING
    // ==========================================

    const booking =
      await bookingRepository.findBookingById(
        data.bookingId
      );

    if (!booking) {

      throw new AppError(
        "Booking not found",
        404
      );
    }


    // ==========================================
    // 2. CHECK BOOKING OWNER
    // ==========================================

    if (
      booking.userId !==
      data.userId
    ) {

      throw new AppError(
        "You cannot review this booking",
        403
      );
    }


    // ==========================================
    // 3. CHECK COMPLETED
    // ==========================================

    if (
      booking.status !==
      BookingStatus.COMPLETED
    ) {

      throw new AppError(
        "Review can only be submitted after service completion",
        400
      );
    }


    // ==========================================
    // 4. CHECK PROVIDER
    // ==========================================

    if (!booking.providerId) {

      throw new AppError(
        "Provider not assigned to this booking",
        400
      );
    }


    // ==========================================
    // 5. CHECK EXISTING REVIEW
    // ==========================================

    const existingReview =
      await reviewRepository.findByBookingId(
        booking.id
      );

    if (existingReview) {

      throw new AppError(
        "You have already reviewed this booking",
        400
      );
    }


    // ==========================================
    // 6. CREATE REVIEW
    // ==========================================

    const result =
      await reviewRepository.create({

        bookingId:
          booking.id,

        userId:
          booking.userId,

        providerId:
          booking.providerId,

        packageId:
          booking.packageId,

        rating:
          data.rating,

        review:
          data.review ?? null,

        images:
          data.images ?? [],

        status:
          "ACTIVE",

      });


    return result;
  }
}

export default new CreateReviewService();