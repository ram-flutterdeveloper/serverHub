import Review from "../models/review.model";
import { User } from "../../auth/models";
import { Provider } from "../../provider/models";
import { Package } from "../../master-data/models";

class ReviewRepository {
  // ==========================================
  // CREATE
  // ==========================================

  async create(data: Partial<Review>) {
    return Review.create(data as any);
  }

  // ==========================================
  // FIND BY ID
  // ==========================================

  async findById(id: string) {
    return Review.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: [
            "id",
            "firstName",
            "lastName",
            "profileImage",
          ],
        },
        {
          model: Provider,
          as: "provider",
        },
        {
          model: Package,
          as: "package",
          attributes: ["id", "name"],
        },
      ],
    });
  }

  // ==========================================
  // FIND BY BOOKING
  // ==========================================

  async findByBookingId(bookingId: string) {
    return Review.findOne({
      where: {
        bookingId,
      },
    });
  }

  // ==========================================
  // PACKAGE REVIEWS
  // ==========================================

  async findByPackageId(
    packageId: string,
    page = 1,
    limit = 10
  ) {
    const offset = (page - 1) * limit;

    return Review.findAndCountAll({
      where: {
        packageId,
        status: "ACTIVE",
      },

      include: [
        {
          model: User,
          as: "user",
          attributes: [
            "id",
            "firstName",
            "lastName",
            "profileImage",
          ],
        },

        {
          model: Provider,
          as: "provider",
        },

        {
          model: Package,
          as: "package",
          attributes: ["id", "name"],
        },
      ],

      order: [["createdAt", "DESC"]],

      limit,
      offset,
    });
  }

  // ==========================================
  // GET RATINGS
  // ==========================================

  async findRatingsByPackageId(packageId: string) {
    return Review.findAll({
      where: {
        packageId,
        status: "ACTIVE",
      },

      attributes: ["rating"],
    });
  }

  // ==========================================
  // PROVIDER REVIEWS
  // ==========================================

  async findByProviderId(
    providerId: string,
    page = 1,
    limit = 10
  ) {
    const offset = (page - 1) * limit;

    return Review.findAndCountAll({
      where: {
        providerId,
        status: "ACTIVE",
      },

      include: [
        {
          model: User,
          as: "user",
          attributes: [
            "id",
            "firstName",
            "lastName",
            "profileImage",
          ],
        },

        {
          model: Package,
          as: "package",
          attributes: ["id", "name"],
        },
      ],

      order: [["createdAt", "DESC"]],

      limit,
      offset,
    });
  }

  // ==========================================
  // ADMIN - ALL REVIEWS
  // ==========================================

  async findAll() {
    return Review.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: [
            "id",
            "firstName",
            "lastName",
            "profileImage",
          ],
        },

        {
          model: Provider,
          as: "provider",
        },

        {
          model: Package,
          as: "package",
          attributes: ["id", "name"],
        },
      ],

      order: [["createdAt", "DESC"]],
    });
  }

  // ==========================================
  // UPDATE
  // ==========================================

  async update(
    id: string,
    data: Partial<Review>
  ) {
    await Review.update(data, {
      where: {
        id,
      },
    });

    return this.findById(id);
  }

  // ==========================================
  // DELETE
  // ==========================================

  async delete(id: string) {
    return Review.destroy({
      where: {
        id,
      },
    });
  }
}

export default new ReviewRepository();