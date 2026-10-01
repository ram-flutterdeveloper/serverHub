import { Request, Response } from "express";

import serviceService from "../services/service.service";

import { asyncHandler } from "../../../helpers/asyncHandler";
import { ApiResponseHelper } from "../../../helpers/api-response";

class ServiceController {
  create = asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      // ------------------------------------
      // Prepare body
      // ------------------------------------

      const body = {
        ...req.body,

        image: req.file
          ? `/uploads/services/${req.file.filename}`
          : null,
      };


      console.log("SERVICE BODY:", body);

      console.log(
        "SERVICE FILE:",
        req.file
      );


      const service =
        await serviceService.create(
          body
        );


      return ApiResponseHelper.success(
        res,
        service,
        "Service created successfully"
      );
    }
  );


  update = asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      const body = {
        ...req.body,

        // Only replace image when
        // a new image is uploaded
        ...(req.file && {
          image:
            `/uploads/services/${req.file.filename}`,
        }),
      };


      const service =
        await serviceService.update(
          req.params.id as string,
          body
        );


      return ApiResponseHelper.success(
        res,
        service,
        "Service updated successfully"
      );
    }
  );

    getAll = asyncHandler(async (req: Request, res: Response) => {
        const services = await serviceService.getAll();

        return ApiResponseHelper.success(
            res,
            services,
            "Services fetched successfully"
        );
    });

    getByCategory = asyncHandler(async (req: Request, res: Response) => {
        const services = await serviceService.getByCategory(
            req.params.categoryId as string
        );

        return ApiResponseHelper.success(
            res,
            services,
            "Services fetched successfully"
        );
    });

    // update = asyncHandler(async (req: Request, res: Response) => {
    //     const service = await serviceService.update(
    //         req.params.id as string,
    //         req.body
    //     );

    //     return ApiResponseHelper.success(
    //         res,
    //         service,
    //         "Service updated successfully"
    //     );
    // });

    delete = asyncHandler(async (req: Request, res: Response) => {
        await serviceService.delete(req.params.id as string);

        return ApiResponseHelper.success(
            res,
            null,
            "Service deleted successfully"
        );
    });
}

export default new ServiceController();