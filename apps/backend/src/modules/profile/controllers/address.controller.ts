import { Request, Response } from "express";

import { asyncHandler } from "../../../helpers/asyncHandler";
import { ApiResponseHelper } from "../../../helpers/api-response";


import getAddressesService from "../services/get-addresses.service";
import updateAddressService from "../services/update-address.service";
import deleteAddressService from "../services/delete-address.service";
import setDefaultAddressService from "../services/set-default-address.service";
import createAddressService from "../services/create-address.service";

class AddressController {

  create = asyncHandler(async (req: Request, res: Response) => {

    const result = await createAddressService.execute({
      ...req.body,
      userId: req.user!.userId,
    });

    return ApiResponseHelper.success(
      res,
      result,
      "Address added successfully"
    );

  });

  getAll = asyncHandler(async (req: Request, res: Response) => {

    const result = await getAddressesService.execute(
      req.user!.userId
    );

    return ApiResponseHelper.success(
      res,
      result,
      "Addresses fetched successfully"
    );

  });

  update = asyncHandler(async (req: Request, res: Response) => {

    const result = await updateAddressService.execute(
      req.params.id as string,
      req.user!.userId,
      req.body
    );

    return ApiResponseHelper.success(
      res,
      result,
      "Address updated successfully"
    );

  });

  delete = asyncHandler(async (req: Request, res: Response) => {

    await deleteAddressService.execute(
      req.params.id as string,
      req.user!.userId
    );

    return ApiResponseHelper.success(
      res,
      null,
      "Address deleted successfully"
    );

  });

  setDefault = asyncHandler(async (req: Request, res: Response) => {

    const result = await setDefaultAddressService.execute(
      req.params.id as string,
      req.user!.userId
    );

    return ApiResponseHelper.success(
      res,
      result,
      "Default address updated successfully"
    );

  });

}

export default new AddressController();