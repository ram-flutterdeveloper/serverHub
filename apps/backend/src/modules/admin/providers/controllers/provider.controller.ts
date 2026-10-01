import { Request, Response } from "express";

import providerService from "../services/provider.service";


import { ApiResponseHelper } from "../../../../helpers/api-response";
import { asyncHandler } from "../../../../helpers/asyncHandler";


class ProviderController {

    dashboard = asyncHandler(async (req, res) => {

        const data =
            await providerService.dashboard();

        return ApiResponseHelper.success(
            res,
            data,
            "Dashboard fetched successfully"
        );

    });

    getAll = asyncHandler(async (req, res) => {

        const data =
            await providerService.getProviders(req.query);

        return ApiResponseHelper.success(
            res,
            data,
            "Providers fetched successfully"
        );

    });

    getById = asyncHandler(async (req, res) => {

        const data =
            await providerService.getProvider(req.params.id as string);

        return ApiResponseHelper.success(
            res,
            data,
            "Provider fetched successfully"
        );

    });

    approve = asyncHandler(async (req, res) => {

    const data =
        await providerService.approve(
            req.params.id as string
        );

    return ApiResponseHelper.success(
        res,
        data,
        data.message
    );

});

reject = asyncHandler(async (req, res) => {

    const data =
        await providerService.reject(
            req.params.id as string
        );

    return ApiResponseHelper.success(
        res,
        data,
        data.message
    );

});

suspend = asyncHandler(async (req, res) => {

    const data =
        await providerService.suspend(
            req.params.id as string
        );

    return ApiResponseHelper.success(
        res,
        data,
        data.message
    );

});

activate = asyncHandler(async (req, res) => {

    const data =
        await providerService.activate(
            req.params.id as string
        );

    return ApiResponseHelper.success(
        res,
        data,
        data.message
    );

});

verifyKyc = asyncHandler(async (req, res) => {

    const data =
        await providerService.verifyKyc(
            req.params.id as string
        );

    return ApiResponseHelper.success(
        res,
        data,
        data.message
    );

});

updateCommission = asyncHandler(async (req, res) => {

    const data =
        await providerService.updateCommission(
            req.params.id as string,
            req.body.commission
        );

    return ApiResponseHelper.success(
        res,
        data,
        data.message
    );

});

}

export default new ProviderController();