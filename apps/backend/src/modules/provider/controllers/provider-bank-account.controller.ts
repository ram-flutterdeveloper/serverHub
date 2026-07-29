import { Response } from "express";

import { AuthRequest } from "../../../middlewares/auth.middleware";
import { asyncHandler } from "../../../helpers/asyncHandler";
import { ApiResponseHelper } from "../../../helpers/api-response";

import providerBankAccountService from "../services/provider-bank-account.service";

class ProviderBankAccountController {

    save = asyncHandler(async (
        req: AuthRequest,
        res: Response
    ) => {

        const result =
            await providerBankAccountService.save(
                req.user!.userId,
                req.body
            );

        return ApiResponseHelper.success(
            res,
            result,
            "Bank account saved successfully"
        );

    });

    getMyBankAccount = asyncHandler(async (
        req: AuthRequest,
        res: Response
    ) => {

        const result =
            await providerBankAccountService.getMyBankAccount(
                req.user!.userId
            );

        return ApiResponseHelper.success(
            res,
            result,
            "Bank account fetched successfully"
        );

    });

    delete = asyncHandler(async (
        req: AuthRequest,
        res: Response
    ) => {

        await providerBankAccountService.delete(
            req.user!.userId
        );

        return ApiResponseHelper.success(
            res,
            null,
            "Bank account deleted successfully"
        );

    });
    update = asyncHandler(async (
    req: AuthRequest,
    res: Response
) => {

    const result =
        await providerBankAccountService.updateBankDetails(
            req.user!.userId,
            req.body
        );

    return ApiResponseHelper.success(
        res,
        result,
        "Bank account updated successfully"
    );

});

}

export default new ProviderBankAccountController();