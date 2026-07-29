import { Request, Response } from "express";

import serviceRequirementService from "../services/service-requirement.service";

import { asyncHandler } from "../../../helpers/asyncHandler";
import { ApiResponseHelper } from "../../../helpers/api-response";

class ServiceRequirementController {

    create = asyncHandler(async(req:Request,res:Response)=>{

        const result = await serviceRequirementService.create(req.body);

        return ApiResponseHelper.success(
            res,
            result,
            "Requirement created successfully"
        );

    });

    getAll = asyncHandler(async(req:Request,res:Response)=>{

        const result = await serviceRequirementService.getAll();

        return ApiResponseHelper.success(
            res,
            result,
            "Requirements fetched successfully"
        );

    });

    getByPackage = asyncHandler(async(req:Request,res:Response)=>{

        const result = await serviceRequirementService.getByPackage(
            req.params.packageId as string
        );

        return ApiResponseHelper.success(
            res,
            result,
            "Requirements fetched successfully"
        );

    });

    update = asyncHandler(async(req:Request,res:Response)=>{

        const result = await serviceRequirementService.update(
            req.params.id as string,
            req.body
        );

        return ApiResponseHelper.success(
            res,
            result,
            "Requirement updated successfully"
        );

    });

    delete = asyncHandler(async(req:Request,res:Response)=>{

        await serviceRequirementService.delete(req.params.id as string);

        return ApiResponseHelper.success(
            res,
            null,
            "Requirement deleted successfully"
        );

    });

}

export default new ServiceRequirementController();