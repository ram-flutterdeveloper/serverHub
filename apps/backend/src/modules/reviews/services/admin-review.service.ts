import { AppError } from "../../../helpers/AppError";
import reviewRepository from "../repositories/review.repository";

class AdminReviewService {

  async getAll() {

    return reviewRepository.findAll();

  }

  async create(data: {
    bookingId: string;
    userId: string;
    providerId: string;
    packageId: string;
    rating: number;
    review?: string;
    images?: string[];
  }) {

    return reviewRepository.create({

      bookingId: data.bookingId,

      userId: data.userId,

      providerId: data.providerId,

      packageId: data.packageId,

      rating: data.rating,

      review: data.review ?? null,

      images: data.images ?? [],

      status: "ACTIVE",

    });
  }

  async update(
    id: string,
    data: {
      rating?: number;
      review?: string;
      images?: string[];
      status?: "ACTIVE" | "INACTIVE";
      adminReply?: string;
    }
  ) {

    const existing =
      await reviewRepository.findById(id);

    if (!existing) {

      throw new AppError(
        "Review not found",
        404
      );
    }


    const updateData: any = {
      ...data,
    };


    if (
      data.adminReply !== undefined
    ) {

      updateData.adminReplyAt =
        new Date();

    }


    return reviewRepository.update(
      id,
      updateData
    );
  }

  async delete(id: string) {

    const existing =
      await reviewRepository.findById(id);

    if (!existing) {

      throw new AppError(
        "Review not found",
        404
      );
    }


    await reviewRepository.delete(id);

    return {
      id,
    };
  }
}

export default new AdminReviewService();