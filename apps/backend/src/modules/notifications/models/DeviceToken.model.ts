import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

import sequelize from "../../../database/sequelize";
import { BaseModel } from "../../../database/models/BaseModel";

class DeviceToken extends BaseModel<
  InferAttributes<DeviceToken>,
  InferCreationAttributes<DeviceToken>
> {
  declare id: string;

  declare userId: string;

  declare token: string;

  declare platform: "ANDROID" | "IOS" | "WEB";

  declare deviceId: string;

  declare isActive: boolean;
}

DeviceToken.init(
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
      onDelete: "CASCADE",
    },

    token: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },

    platform: {
      type: DataTypes.ENUM(
        "ANDROID",
        "IOS",
        "WEB"
      ),
      allowNull: false,
    },

    deviceId: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: "device_tokens",
    timestamps: true,
    paranoid: true,
  }
);

export default DeviceToken;