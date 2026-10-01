import reviewRepository
  from "../repositories/review.repository";


class PackageReviewsService {

  async execute(
    packageId: string,
    page = 1,
    limit = 10
  ) {

    // ==========================================
    // ALL RATINGS FOR SUMMARY
    // ==========================================

    const ratingRows =
      await reviewRepository.findRatingsByPackageId(
        packageId
      );


    const totalReviews =
      ratingRows.length;


    const totalRating =
      ratingRows.reduce(
        (sum, item) =>
          sum + Number(item.rating),
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


    const ratingCounts = {

      5: ratingRows.filter(
        item => Number(item.rating) === 5
      ).length,

      4: ratingRows.filter(
        item => Number(item.rating) === 4
      ).length,

      3: ratingRows.filter(
        item => Number(item.rating) === 3
      ).length,

      2: ratingRows.filter(
        item => Number(item.rating) === 2
      ).length,

      1: ratingRows.filter(
        item => Number(item.rating) === 1
      ).length,

    };


    // ==========================================
    // PAGINATED REVIEWS
    // ==========================================

    const result =
      await reviewRepository.findByPackageId(
        packageId,
        page,
        limit
      );


    const totalPages =
      Math.ceil(
        result.count / limit
      );


    return {

      summary: {

        averageRating,

        totalReviews,

        ratingCounts,

      },


      reviews:
        result.rows,


      pagination: {

        page,

        limit,

        total:
          result.count,

        totalPages,

      },

    };

  }

}


export default new PackageReviewsService();