import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

import sequelize from "../../../database/sequelize";
import { BaseModel } from "../../../database/models/BaseModel";


class SupportConversation extends BaseModel<
  InferAttributes<SupportConversation>,
  InferCreationAttributes<SupportConversation>
> {

  declare id: string;

  // Customer
  declare userId: string;

  // Admin / support agent
  declare assignedAgentId: string | null;

  // Optional booking related to support request
  declare bookingId: string | null;

  // Conversation subject
  declare subject: string | null;

  // Conversation status
  declare status:
    | "WAITING"
    | "ACTIVE"
    | "RESOLVED"
    | "CLOSED";

  // Last message time
  declare lastMessageAt: Date | null;

  // Conversation closed time
  declare closedAt: Date | null;
}

SupportConversation.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    assignedAgentId: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    bookingId: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    subject: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    status: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: "WAITING",
    },

    lastMessageAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    closedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,

    tableName: "support_conversations",

    timestamps: true,

    paranoid: true,

    indexes: [
      {
        fields: ["userId"],
      },

      {
        fields: ["assignedAgentId"],
      },

      {
        fields: ["bookingId"],
      },

      {
        fields: ["status"],
      },

      {
        fields: ["lastMessageAt"],
      },
    ],
  }
);

export default SupportConversation;