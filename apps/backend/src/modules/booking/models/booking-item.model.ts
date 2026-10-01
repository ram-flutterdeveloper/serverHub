import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

import sequelize from "../../../database/sequelize";
import { BaseModel } from "../../../database/models/BaseModel";

class BookingItem extends BaseModel<
  InferAttributes<BookingItem>,
  InferCreationAttributes<BookingItem>
> {
  declare id: string;

  declare bookingId: string;

  declare categoryId: string;

  declare subCategoryId: string | null;

  declare serviceId: string;

  declare packageId: string;


  declare packageName: string;

  declare packageDescription: string | null;

  declare duration: number;

  declare quantity: number;

  declare unitPrice: number;

  declare discount: number;

  declare tax: number;

  declare totalPrice: number;
}

BookingItem.init(
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

    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "categories",
        key: "id",
      },
    },

    subCategoryId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "sub_categories",
        key: "id",
      },
    },

    serviceId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "services",
        key: "id",
      },
    },

    packageId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "packages",
        key: "id",
      },
    },

    packageName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    packageDescription: {
      type: DataTypes.TEXT,
    },

    duration: {
      // Duration in minutes
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },

    unitPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    discount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },

    tax: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },

    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "booking_items",
    timestamps: true,
    paranoid: true,
  }
);

export default BookingItem;