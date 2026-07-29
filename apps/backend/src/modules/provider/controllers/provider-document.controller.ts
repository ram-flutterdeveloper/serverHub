import { Response } from "express";

import { AuthRequest } from "../../../middlewares/auth.middleware";
import { asyncHandler } from "../../../helpers/asyncHandler";
import { ApiResponseHelper } from "../../../helpers/api-response";

import providerDocumentService from "../services/provider-document.service";

class ProviderDocumentController {

    upload = asyncHandler(async (
        req: AuthRequest,
        res: Response
    ) => {

        const result =
            await providerDocumentService.upload(
                req.user!.userId,
                req.body,
                req.files
            );

        return ApiResponseHelper.success(
            res,
            result,
            "Document uploaded successfully"
        );

    });

    getMyDocuments = asyncHandler(async (
        req: AuthRequest,
        res: Response
    ) => {

        const result =
            await providerDocumentService.getMyDocuments(
                req.user!.userId
            );

        return ApiResponseHelper.success(
            res,
            result,
            "Documents fetched successfully"
        );

    });

    delete = asyncHandler(async (
        req: AuthRequest,
        res: Response
    ) => {

        await providerDocumentService.delete(
            req.user!.userId,
            req.params.id as string
        );

        return ApiResponseHelper.success(
            res,
            null,
            "Document deleted successfully"
        );

    });

}

export default new ProviderDocumentController();