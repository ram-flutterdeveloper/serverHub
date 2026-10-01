import supportConversationRepository
    from "../repositories/support-conversation.repository";

import { AppError } from "../../../helpers/AppError";

class CreateConversationService {

    async execute(data: {
        userId: string;
        bookingId?: string;
        subject?: string;
    }) {
        const existing =
            await supportConversationRepository
                .findActiveByUserId(data.userId);

        if (existing) {
            return existing;
        }
        const conversation =
            await supportConversationRepository.create({
                userId: data.userId,
                bookingId: data.bookingId ?? null,
                subject: data.subject ?? null,
            });

        return conversation;
    }
}

export default new CreateConversationService();