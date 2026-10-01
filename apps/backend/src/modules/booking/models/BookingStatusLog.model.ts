import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

import sequelize from "../../../database/sequelize";
import { BaseModel } from "../../../database/models/BaseModel";
import { BookingStatus } from "../../../constants/booking-status";

class BookingStatusLog extends BaseModel<
  InferAttributes<BookingStatusLog>,
  InferCreationAttributes<BookingStatusLog>
> {
  declare id: string;

  declare bookingId: string;

  declare status: BookingStatus;

  declare remarks: string | null;

  declare updatedBy: string | null;

  declare updatedByRole:
    | "CUSTOMER"
    | "PROVIDER"
    | "ADMIN"
    | "SYSTEM";
}

BookingStatusLog.init(
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

    status: {
      type: DataTypes.ENUM(
        ...Object.values(BookingStatus)
      ),
      allowNull: false,
    },

    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    updatedBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    updatedByRole: {
      type: DataTypes.ENUM(
        "CUSTOMER",
        "PROVIDER",
        "ADMIN",
        "SYSTEM"
      ),
      defaultValue: "SYSTEM",
    },
  },
  {
    sequelize,
    tableName: "booking_status_logs",
    timestamps: true,

    // We generally don't soft-delete status history.
    paranoid: false,

    updatedAt: false,
  }
);

export default BookingStatusLog;