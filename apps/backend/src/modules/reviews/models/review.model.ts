import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

import sequelize from "../../../database/sequelize";
import { BaseModel } from "../../../database/models/BaseModel";

class Review extends BaseModel<
  InferAttributes<Review>,
  InferCreationAttributes<Review>
> {
  declare id: string;

  declare bookingId: string;

  declare userId: string;

  declare providerId: string;

  declare packageId: string;

  declare rating: number;

  declare review: string | null;

  declare images: string[];

  declare status: "ACTIVE" | "INACTIVE";

  declare adminReply: string | null;

  declare adminReplyAt: Date | null;
}

Review.init(
  {
    // ==========================================
    // ID
    // ==========================================

    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    // ==========================================
    // BOOKING
    // ==========================================

    bookingId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
    },

    // ==========================================
    // USER
    // ==========================================

    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    // ==========================================
    // PROVIDER
    // ==========================================

    providerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    // ==========================================
    // PACKAGE
    // ==========================================

    packageId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    // ==========================================
    // RATING
    // ==========================================

    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,

      validate: {
        min: 1,
        max: 5,
      },
    },

    // ==========================================
    // REVIEW
    // ==========================================

    review: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    // ==========================================
    // REVIEW IMAGES
    // ==========================================

    images: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },

    // ==========================================
    // STATUS
    // ==========================================

    status: {
      type: DataTypes.ENUM(
        "ACTIVE",
        "INACTIVE"
      ),

      allowNull: false,

      defaultValue: "ACTIVE",
    },

    // ==========================================
    // ADMIN REPLY
    // ==========================================

    adminReply: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    adminReplyAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },

  {
    sequelize,

    tableName: "reviews",

    timestamps: true,

    paranoid: true,
  }
);

export default Review;