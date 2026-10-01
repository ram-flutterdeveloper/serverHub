import packageRepository from "../repositories/package.repository";
import subCategoryRepository from "../repositories/sub-category.repository";
import { AppError } from "../../../helpers/AppError";
import serviceRepository from "../repositories/service.repository";

class PackageService {

    // async create(body: any) {

    //     const subCategory = await subCategoryRepository.findById(body.subCategoryId);

    //     if (!subCategory) {
    //         throw new AppError("Sub Category not found", 404);
    //     }

    //     const exists = await packageRepository.findByName(body.name);

    //     if (exists) {
    //         throw new AppError("Package already exists", 400);
    //     }

    //     return packageRepository.create({
    //         ...body,
    //         slug: body.name.toLowerCase().replace(/\s+/g, "-"),
    //     });

    // }

    async create(body: any) {

        // =====================================
        // SERVICE REQUIRED
        // =====================================

        if (!body.serviceId) {

            throw new AppError(
                "Service is required",
                400
            );
        }


        // =====================================
        // CHECK SERVICE
        // =====================================

        const service =
            await serviceRepository.findById(
                body.serviceId
            );


        if (!service) {

            throw new AppError(
                "Service not found",
                404
            );
        }


        // =====================================
        // SUB CATEGORY OPTIONAL
        // =====================================

        if (body.subCategoryId) {

            const subCategory =
                await subCategoryRepository.findById(
                    body.subCategoryId
                );


            if (!subCategory) {

                throw new AppError(
                    "Sub Category not found",
                    404
                );
            }


            // Make sure the subcategory
            // belongs to this service

            if (
                subCategory.serviceId !==
                body.serviceId
            ) {

                throw new AppError(
                    "Sub Category does not belong to this Service",
                    400
                );
            }
        }


        // =====================================
        // DUPLICATE PACKAGE
        // =====================================

        const exists =
            await packageRepository.findByName(
                body.name
            );


        if (exists) {

            throw new AppError(
                "Package already exists",
                400
            );
        }


        // =====================================
        // CREATE
        // =====================================

        return packageRepository.create({

            ...body,

            serviceId:
                body.serviceId,

            subCategoryId:
                body.subCategoryId ||
                null,

            slug:
                body.name
                    .trim()
                    .toLowerCase()
                    .replace(
                        /[^a-z0-9]+/g,
                        "-"
                    )
                    .replace(
                        /^-+|-+$/g,
                        ""
                    ),

        });
    }


    async getAll() {
        return packageRepository.findAll();
    }

      async getByService(serviceId: string) {
        return packageRepository.findByService(serviceId);
    }

    async getBySubCategory(subCategoryId: string) {
        return packageRepository.findBySubCategory(subCategoryId);
    }

    async update(
        id: string,
        body: any
    ) {

        const existing =
            await packageRepository.findById(
                id
            );


        if (!existing) {

            throw new AppError(
                "Package not found",
                404
            );
        }


        // =====================================
        // SERVICE
        // =====================================

        const serviceId =
            body.serviceId ||
            existing.serviceId;


        if (!serviceId) {

            throw new AppError(
                "Service is required",
                400
            );
        }


        const service =
            await serviceRepository.findById(
                serviceId
            );


        if (!service) {

            throw new AppError(
                "Service not found",
                404
            );
        }


        // =====================================
        // OPTIONAL SUB CATEGORY
        // =====================================

        if (body.subCategoryId) {

            const subCategory =
                await subCategoryRepository.findById(
                    body.subCategoryId
                );


            if (!subCategory) {

                throw new AppError(
                    "Sub Category not found",
                    404
                );
            }


            if (
                subCategory.serviceId !==
                serviceId
            ) {

                throw new AppError(
                    "Sub Category does not belong to this Service",
                    400
                );
            }
        }


        // =====================================
        // ALLOW REMOVE SUBCATEGORY
        // =====================================

        if (
            Object.prototype.hasOwnProperty.call(
                body,
                "subCategoryId"
            ) &&
            !body.subCategoryId
        ) {

            body.subCategoryId = null;

        }


        // =====================================
        // UPDATE
        // =====================================

        return packageRepository.update(
            id,
            {
                ...body,

                serviceId,

                ...(body.name && {
                    slug:
                        body.name
                            .trim()
                            .toLowerCase()
                            .replace(
                                /[^a-z0-9]+/g,
                                "-"
                            )
                            .replace(
                                /^-+|-+$/g,
                                ""
                            ),
                }),
            }
        );
    }


    async delete(id: string) {
        await packageRepository.delete(id);
    }
}

export default new PackageService();