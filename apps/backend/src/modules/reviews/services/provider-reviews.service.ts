import { AppError } from "../../../helpers/AppError";
import providerRepository from "../../provider/repositories/provider.repository";
import reviewRepository from "../repositories/review.repository";

class ProviderReviewsService {

  async execute(
    userId: string
  ) {

    // Find provider using logged-in user
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


    const reviews =
      await reviewRepository.findByProviderId(
        provider.id
      );


    const totalReviews =
      reviews.length;


    const totalRating =
      reviews.reduce(
        (sum, item) =>
          sum + item.rating,
        0
      );


    const averageRating =
      totalReviews > 0
        ? Number(
          (
            totalRating /
            totalReviews
          ).toFixed(1)
        )
        : 0;


    return {

      summary: {

        averageRating,

        totalReviews,

      },

      reviews,
    };
  }
}

export default new ProviderReviewsService();