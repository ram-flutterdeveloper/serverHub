import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

import sequelize from "../../../database/sequelize";
import { BaseModel } from "../../../database/models/BaseModel";

class BookingMedia extends BaseModel<
  InferAttributes<BookingMedia>,
  InferCreationAttributes<BookingMedia>
> {

  declare id: string;

  declare bookingId: string;

  declare type: "IMAGE" | "VIDEO";

  declare url: string;

}

BookingMedia.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    bookingId: {
      type: DataTypes.UUID,
      allowNull: false,

      references: {
        model: "bookings",
        key: "id",
      },

      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },

    type: {
      type: DataTypes.ENUM(
        "IMAGE",
        "VIDEO"
      ),

      allowNull: false,
    },

    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "booking_media",
    timestamps: true,
  }
);

export default BookingMedia;