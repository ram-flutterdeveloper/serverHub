import favouriteRepository from "../repositories/favourite.repository";

class GetFavouritesService {

  async execute(
    userId: string,
    page = 1,
    limit = 10
  ) {

    // ==========================================
    // NORMALIZE PAGINATION
    // ==========================================

    page = Math.max(1, page);

    limit = Math.min(
      Math.max(1, limit),
      50
    );

    const offset =
      (page - 1) * limit;


    // ==========================================
    // GET FAVOURITES
    // ==========================================

    const result =
      await favouriteRepository.findByUserIdPaginated(
        userId,
        limit,
        offset
      );


    // ==========================================
    // TOTAL PAGES
    // ==========================================

    const total =
      result.count;

    const totalPages =
      Math.ceil(total / limit);


    // ==========================================
    // RESPONSE
    // ==========================================

    return {
      favourites: result.rows,

      pagination: {
        page,
        limit,
        total,
        totalPages,

        hasNextPage:
          page < totalPages,

        hasPreviousPage:
          page > 1,
      },
    };
  }

}

export default new GetFavouritesService();