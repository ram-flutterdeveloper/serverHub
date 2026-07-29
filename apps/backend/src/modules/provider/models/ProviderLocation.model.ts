import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

import sequelize from "../../../database/sequelize";
import { BaseModel } from "../../../database/models/BaseModel";

class ProviderLocation extends BaseModel<
  InferAttributes<ProviderLocation>,
  InferCreationAttributes<ProviderLocation>
> {
  declare id: string;

  declare providerId: string;

  declare cityId: string;

  declare areaId: string;

  declare googlePlaceId: string | null;

  declare addressLine1: string;

  declare addressLine2: string | null;

  declare landmark: string | null;

  declare latitude: number;

  declare longitude: number;

  declare pincode: string;

  declare serviceRadius: number;

  declare isPrimary: boolean;
}

ProviderLocation.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    providerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "providers",
        key: "id",
      },
      onDelete: "CASCADE",
    },

    cityId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "cities",
        key: "id",
      },
    },

    areaId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "areas",
        key: "id",
      },
    },

    googlePlaceId: {
      type: DataTypes.STRING,
    },

    addressLine1: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    addressLine2: {
      type: DataTypes.STRING,
    },

    landmark: {
      type: DataTypes.STRING,
    },

    latitude: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },

    longitude: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },

    pincode: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },

    serviceRadius: {
      type: DataTypes.INTEGER,
      defaultValue: 10,
    },

    isPrimary: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: "provider_locations",
    timestamps: true,
    paranoid: true,
  }
);

export default ProviderLocation;