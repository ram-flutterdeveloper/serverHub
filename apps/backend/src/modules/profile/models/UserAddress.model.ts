import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

import sequelize from "../../../database/sequelize";
import { BaseModel } from "../../../database/models/BaseModel";

class UserAddress extends BaseModel<
  InferAttributes<UserAddress>,
  InferCreationAttributes<UserAddress>
> {
  declare id: string;

  declare userId: string;

  declare cityId: string;

  declare areaId: string;

  declare houseNo: string;

  declare buildingName: string | null;

  declare floor: string | null;

  declare street: string | null;

  declare landmark: string | null;

  declare addressLine: string;

  declare latitude: number | null;

  declare longitude: number | null;

  declare contactPerson: string;

  declare contactNumber: string;

  declare addressType: "HOME" | "WORK" | "OTHER";

  declare isDefault: boolean;

  declare status: "ACTIVE" | "INACTIVE";
}

UserAddress.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },

    cityId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "cities",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },

    areaId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "areas",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },

    houseNo: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    buildingName: {
      type: DataTypes.STRING(200),
    },

    floor: {
      type: DataTypes.STRING(50),
    },

    street: {
      type: DataTypes.STRING(200),
    },

    landmark: {
      type: DataTypes.STRING(255),
    },

    addressLine: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    latitude: {
      type: DataTypes.DOUBLE,
    },

    longitude: {
      type: DataTypes.DOUBLE,
    },

    contactPerson: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },

    contactNumber: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },

    addressType: {
      type: DataTypes.ENUM(
        "HOME",
        "WORK",
        "OTHER"
      ),
      defaultValue: "HOME",
    },

    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    status: {
      type: DataTypes.ENUM(
        "ACTIVE",
        "INACTIVE"
      ),
      defaultValue: "ACTIVE",
    },
  },
  {
    sequelize,
    tableName: "user_addresses",
    timestamps: true,
    paranoid: true,
  }
);

export default UserAddress;