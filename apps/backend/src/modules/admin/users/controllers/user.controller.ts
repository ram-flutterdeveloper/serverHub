import { Request, Response } from "express";
import userService from "../services/user.service";
import { asyncHandler } from "../../../../helpers/asyncHandler";
import { ApiResponseHelper } from "../../../../helpers/api-response";


class UserController {

    /**
     * Dashboard
     * GET /admin/users/dashboard
     */
    dashboard = asyncHandler(async (req: Request, res: Response) => {

        const data = await userService.dashboard();

        return ApiResponseHelper.success(
            res,
            data,
            "Dashboard fetched successfully"
        );
    });

    /**
     * User List
     * GET /admin/users
     */
    getAll = asyncHandler(async (req: Request, res: Response) => {

        const data = await userService.getUsers(req.query);

        return ApiResponseHelper.success(
            res,
            data,
            "Users fetched successfully"
        );
    });

    /**
     * User Details
     * GET /admin/users/:id
     */
    getById = asyncHandler(async (req: Request, res: Response) => {

        const data = await userService.getUser(req.params.id as string);

        return ApiResponseHelper.success(
            res,
            data,
            "User fetched successfully"
        );
    });

    /**
     * Block User
     * PATCH /admin/users/:id/block
     */
    block = asyncHandler(async (req: Request, res: Response) => {

        const data = await userService.block(req.params.id as string);

        return ApiResponseHelper.success(
            res,
            data,
            data.message
        );
    });

    /**
     * Unblock User
     * PATCH /admin/users/:id/unblock
     */
    unblock = asyncHandler(async (req: Request, res: Response) => {

        const data = await userService.unblock(req.params.id as string);

        return ApiResponseHelper.success(
            res,
            data,
            data.message
        );
    });

    /**
     * Verify User
     * PATCH /admin/users/:id/verify
     */
    verify = asyncHandler(async (req: Request, res: Response) => {

        const data = await userService.verify(req.params.id as string);

        return ApiResponseHelper.success(
            res,
            data,
            data.message
        );
    });

    /**
     * Soft Delete User
     * DELETE /admin/users/:id
     */
    delete = asyncHandler(async (req: Request, res: Response) => {

        const data = await userService.delete(req.params.id as string);

        return ApiResponseHelper.success(
            res,
            data,
            data.message
        );
    });

}

export default new UserController();