import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

import sequelize from "../../../database/sequelize";
import { BaseModel } from "../../../database/models/BaseModel";

class Notification extends BaseModel<
  InferAttributes<Notification>,
  InferCreationAttributes<Notification>
> {
  declare id: string;

  declare userId: string;

  declare title: string;

  declare body: string;

  declare type: string;

  declare referenceId: string | null;

  declare image: string | null;

  declare isRead: boolean;

  declare readAt: Date | null;

  declare data: object | null;
}

Notification.init(
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

    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    type: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    referenceId: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    data: {
      type: DataTypes.JSONB,
      allowNull: true,
    },

    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    readAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "notifications",
    timestamps: true,
    paranoid: true,

    indexes: [
      {
        fields: ["userId"],
      },
      {
        fields: ["isRead"],
      },
      {
        fields: ["type"],
      },
      {
        fields: ["createdAt"],
      },
    ],
  }
);

export default Notification;