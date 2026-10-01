import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

import sequelize from "../../../database/sequelize";
import { BaseModel } from "../../../database/models/BaseModel";

class BookingRequirement extends BaseModel<
  InferAttributes<BookingRequirement>,
  InferCreationAttributes<BookingRequirement>
> {
  declare id: string;

  declare bookingId: string;

  declare requirementId: string;

  declare requirementTitle: string;

  declare value: string;

  declare extraPrice: number;
}

BookingRequirement.init(
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

    requirementId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "service_requirements",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },

    requirementTitle: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    value: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    extraPrice: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: "booking_requirements",
    timestamps: true,
    paranoid: true,
  }
);

export default BookingRequirement;