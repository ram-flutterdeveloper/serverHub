import SupportConversation from "../models/SupportConversation.model";

class SupportConversationRepository {

  async create(data: {
    userId: string;
    bookingId?: string | null;
    subject?: string | null;
  }) {

    return SupportConversation.create({
      userId: data.userId,
      bookingId: data.bookingId ?? null,
      subject: data.subject ?? null,
      status: "WAITING",
      lastMessageAt: null,
      closedAt: null,
      assignedAgentId: null,
    });
  }

  async findById(id: string) {

    return SupportConversation.findByPk(id);
  }

  async findByUserId(userId: string) {

    return SupportConversation.findAll({
      where: {
        userId,
      },

      order: [
        ["lastMessageAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    });
  }

  async findActiveByUserId(userId: string) {

    return SupportConversation.findOne({
      where: {
        userId,
        status: [
          "WAITING",
          "ACTIVE",
        ],
      },
      order: [
        ["createdAt", "DESC"],
      ],
    });
  }

  
}

export default new SupportConversationRepository();