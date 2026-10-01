import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

import sequelize from "../../../database/sequelize";
import { BaseModel } from "../../../database/models/BaseModel";
import { BookingStatus } from "../../../constants/booking-status";

class Booking extends BaseModel<
  InferAttributes<Booking>,
  InferCreationAttributes<Booking>
> {
  declare id: string;

  declare bookingNumber: string;

  declare userId: string;

  declare providerId: string | null;

  declare packageId: string;

  declare addressId: string;

  declare bookingDate: Date;

  declare bookingTime: string;

  declare status: BookingStatus;

  declare paymentMethod: "COD" | "ONLINE";

  declare paymentStatus: "PENDING" | "PAID";

  declare subtotal: number;

  declare discount: number;

  declare tax: number;

  declare extraCharge: number;

  declare totalAmount: number;

  declare notes: string | null;

  declare cancelledReason: string | null;

  declare cancelledAt: Date | null;
  declare assignmentExpiresAt: Date | null;

  declare assignedAt: Date | null;

  declare acceptedAt: Date | null;

  declare rejectedAt: Date | null;

  declare assignedBy: string | null;

  declare rejectionReason: string | null;

  declare onTheWayAt?: Date | null;
  declare arrivedAt?: Date | null;
  declare completedAt?: Date | null;
  declare arrivalOtp: string | null;
  declare arrivalOtpVerifiedAt: Date | null;
}

Booking.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    bookingNumber: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
    },

    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },

    providerId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "providers",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },

    packageId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "packages",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },

    addressId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "user_addresses",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },

    bookingDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    bookingTime: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM(...Object.values(BookingStatus)),
      allowNull: false,
      defaultValue: BookingStatus.PENDING,
    },

    paymentMethod: {
      type: DataTypes.ENUM(
        "COD",
        "ONLINE"
      ),
      allowNull: false,
      defaultValue: "COD",
    },

    paymentStatus: {
      type: DataTypes.ENUM(
        "PENDING",
        "PAID"
      ),
      defaultValue: "PENDING",
    },

    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },

    discount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },

    tax: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },

    extraCharge: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },

    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },

    notes: {
      type: DataTypes.TEXT,
    },

    cancelledReason: {
      type: DataTypes.TEXT,
    },

    cancelledAt: {
      type: DataTypes.DATE,
    },

    assignedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },

    assignedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    assignmentExpiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    acceptedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    rejectedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    rejectionReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    onTheWayAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    arrivedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    arrivalOtp: {
      type: DataTypes.STRING(6),
      allowNull: true,
    },

    arrivalOtpVerifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "bookings",
    timestamps: true,
    paranoid: true,
  }
);

export default Booking;