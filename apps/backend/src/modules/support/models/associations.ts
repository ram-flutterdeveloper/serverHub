import User from "../../auth/models/User.model";
import { Booking } from "../../booking/models";


import SupportConversation
  from "./SupportConversation.model";

import SupportMessage
  from "./SupportMessage.model";


// ==========================================
// Conversation → User
// ==========================================

SupportConversation.belongsTo(
  User,
  {
    foreignKey: "userId",
    as: "user",
  }
);

User.hasMany(
  SupportConversation,
  {
    foreignKey: "userId",
    as: "supportConversations",
  }
);


// ==========================================
// Conversation → Assigned Admin
// ==========================================

SupportConversation.belongsTo(
  User,
  {
    foreignKey: "assignedAgentId",
    as: "assignedAgent",
  }
);


// ==========================================
// Conversation → Booking
// ==========================================

SupportConversation.belongsTo(
  Booking,
  {
    foreignKey: "bookingId",
    as: "booking",
  }
);


// ==========================================
// Message → Conversation
// ==========================================

SupportMessage.belongsTo(
  SupportConversation,
  {
    foreignKey: "conversationId",
    as: "conversation",
  }
);

SupportConversation.hasMany(
  SupportMessage,
  {
    foreignKey: "conversationId",
    as: "messages",
  }
);


// ==========================================
// Message → Sender
// ==========================================

SupportMessage.belongsTo(
  User,
  {
    foreignKey: "senderId",
    as: "sender",
  }
);

User.hasMany(
  SupportMessage,
  {
    foreignKey: "senderId",
    as: "supportMessages",
  }
);