import { Request, Response } from "express";

import { asyncHandler } from "../../../helpers/asyncHandler";
import { ApiResponseHelper } from "../../../helpers/api-response";

import createConversationService
  from "../services/create-conversation.service";

class SupportController {

  createConversation = asyncHandler(
    async (req: Request, res: Response) => {

      const userId =
        req.user!.userId;

      const conversation =
        await createConversationService.execute({
          userId,

          bookingId:
            req.body.bookingId,

          subject:
            req.body.subject,
        });

      return ApiResponseHelper.success(
        res,
        conversation,
        "Support conversation created successfully"
      );
    }
  );
}

export default new SupportController();