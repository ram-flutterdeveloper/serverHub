import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

import sequelize from "../../../database/sequelize";
import { BaseModel } from "../../../database/models/BaseModel";


class SupportMessage extends BaseModel<
  InferAttributes<SupportMessage>,
  InferCreationAttributes<SupportMessage>
> {

  declare id: string;

  // Conversation
  declare conversationId: string;

  // User who sent the message
  declare senderId: string;

  // CUSTOMER / ADMIN / PROVIDER
  declare senderRole:
    | "CUSTOMER"
    | "ADMIN"
    | "PROVIDER";

  // Message text
  declare message: string | null;

  // TEXT / IMAGE / VIDEO / FILE
  declare messageType:
    | "TEXT"
    | "IMAGE"
    | "VIDEO"
    | "FILE";

  // Optional attachment
  declare attachment: string | null;

  // Read status
  declare isRead: boolean;

  declare readAt: Date | null;
}

SupportMessage.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    conversationId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    senderId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    senderRole: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },

    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    messageType: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: "TEXT",
    },

    attachment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    isRead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    readAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,

    tableName: "support_messages",

    timestamps: true,

    paranoid: true,

    indexes: [
      {
        fields: ["conversationId"],
      },

      {
        fields: ["senderId"],
      },

      {
        fields: ["createdAt"],
      },

      {
        fields: ["isRead"],
      },
    ],
  }
);

export default SupportMessage;