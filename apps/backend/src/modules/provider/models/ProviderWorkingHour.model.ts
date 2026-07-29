import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

import sequelize from "../../../database/sequelize";
import { BaseModel } from "../../../database/models/BaseModel";

class ProviderWorkingHour extends BaseModel<
  InferAttributes<ProviderWorkingHour>,
  InferCreationAttributes<ProviderWorkingHour>
> {
  declare id: string;

  declare providerId: string;

  declare dayOfWeek:
    | "MONDAY"
    | "TUESDAY"
    | "WEDNESDAY"
    | "THURSDAY"
    | "FRIDAY"
    | "SATURDAY"
    | "SUNDAY";

  declare isOpen: boolean;

  declare openTime: string | null;

  declare closeTime: string | null;
}

ProviderWorkingHour.init(
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

    dayOfWeek: {
      type: DataTypes.ENUM(
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
        "SUNDAY"
      ),
      allowNull: false,
    },

    isOpen: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    openTime: {
      type: DataTypes.TIME,
    },

    closeTime: {
      type: DataTypes.TIME,
    },
  },
  {
    sequelize,
    tableName: "provider_working_hours",
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        unique: true,
        fields: ["providerId", "dayOfWeek"],
      },
    ],
  }
);

export default ProviderWorkingHour;