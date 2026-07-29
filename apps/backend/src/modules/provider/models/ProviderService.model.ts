import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

import sequelize from "../../../database/sequelize";
import { BaseModel } from "../../../database/models/BaseModel";

class ProviderService extends BaseModel<
  InferAttributes<ProviderService>,
  InferCreationAttributes<ProviderService>
> {
  declare id: string;

  declare providerId: string;

  declare serviceId: string;

  declare isActive: boolean;
}

ProviderService.init(
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

    serviceId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "services",
        key: "id",
      },
      onDelete: "CASCADE",
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: "provider_services",
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        unique: true,
        fields: ["providerId", "serviceId"],
      },
    ],
  }
);

export default ProviderService;