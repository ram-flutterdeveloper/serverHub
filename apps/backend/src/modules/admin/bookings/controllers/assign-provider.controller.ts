import { ApiResponseHelper } from "../../../../helpers/api-response";
import { asyncHandler } from "../../../../helpers/asyncHandler";
import assignProviderService from "../services/assign-provider.service";

class AssignProviderController {

    assign = asyncHandler(async (req, res) => {

        const booking =
            await assignProviderService.execute(
                req.params.bookingId as string,
                req.body.providerId as string,
                req.user!.userId as string
            );

        return ApiResponseHelper.success(
            res,
            booking,
            "Provider assigned successfully"
        );

    });

}

export default new AssignProviderController();