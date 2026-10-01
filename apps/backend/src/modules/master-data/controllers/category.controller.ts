import { Request, Response } from "express";
import categoryService from "../services/category.service";
import { asyncHandler } from "../../../helpers/asyncHandler";
import { ApiResponseHelper } from "../../../helpers/api-response";

class CategoryController {
    // create = asyncHandler(async (req: Request, res: Response) => {
    //     const category = await categoryService.create(req.body);

    //     return ApiResponseHelper.success(
    //         res,
    //         category,
    //         "Category created successfully"
    //     );
    // });

    create = asyncHandler(
        async (
            req: Request,
            res: Response
        ) => {

            const category =
                await categoryService.create(
                    req.body,
                    req.file
                );

            return ApiResponseHelper.success(
                res,
                category,
                "Category created successfully"
            );
        }
    );

    getAll = asyncHandler(async (_req: Request, res: Response) => {
        const categories = await categoryService.getAll();

        return ApiResponseHelper.success(
            res,
            categories,
            "Categories fetched successfully"
        );
    });

    update = asyncHandler(
        async (
            req: Request,
            res: Response
        ) => {

            const category =
                await categoryService.update(
                    req.params.id as string,
                    req.body,
                    req.file
                );

            return ApiResponseHelper.success(
                res,
                category,
                "Category updated successfully"
            );
        }
    );

    delete = asyncHandler(async (req: Request, res: Response) => {
        const id = req.params.id as string;


        await categoryService.delete(Number(req.params.id));

        return ApiResponseHelper.success(
            res,
            null,
            "Category deleted successfully"
        );
    });
}

export default new CategoryController();