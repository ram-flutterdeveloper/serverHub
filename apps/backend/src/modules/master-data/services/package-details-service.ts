import sequelize from "../../../database/sequelize";
import { AppError } from "../../../helpers/AppError";
import { CreatePackageDetailsDto } from "../models/package-details.dto";
import packageDetailsRepository from "../repositories/package-details-repository";

import packageRepository
    from "../repositories/package.repository";



class PackageDetailsService {

    async create(
        packageId: string,
        data: CreatePackageDetailsDto
    ) {

        const transaction =
            await sequelize.transaction();

        try {

            // ==========================================
            // 1. CHECK PACKAGE
            // ==========================================

            const packageData =
                await packageRepository.findById(
                    packageId
                );

            if (!packageData) {

                throw new AppError(
                    "Package not found",
                    404
                );

            }


            // ==========================================
            // 2. PACKAGE BASIC DETAILS
            // ==========================================

            await packageDetailsRepository.createDetail(
                {
                    packageId,

                    description:
                        data.description ?? null,

                    whyChooseUs:
                        data.whyChooseUs ?? null,
                },

                transaction
            );


            // ==========================================
            // 3. IMAGES
            // ==========================================

            if (data.images?.length) {

                await packageDetailsRepository.createImages(

                    data.images.map((item) => ({

                        packageId,

                        image: item.image,

                        title:
                            item.title ?? null,

                        sortOrder:
                            item.sortOrder ?? 0,

                    })),

                    transaction
                );

            }


            // ==========================================
            // 4. INCLUDED
            // ==========================================

            if (data.included?.length) {

                await packageDetailsRepository.createIncluded(

                    data.included.map((item) => ({

                        packageId,

                        title: item.title,

                        description:
                            item.description ?? null,

                        image:
                            item.image ?? null,

                        sortOrder:
                            item.sortOrder ?? 0,

                    })),

                    transaction
                );

            }


            // ==========================================
            // 5. EXCLUDED
            // ==========================================

            if (data.excluded?.length) {

                await packageDetailsRepository.createExcluded(

                    data.excluded.map((item) => ({

                        packageId,

                        title: item.title,

                        description:
                            item.description ?? null,

                        image:
                            item.image ?? null,

                        sortOrder:
                            item.sortOrder ?? 0,

                    })),

                    transaction
                );

            }


            // ==========================================
            // 6. HOW IT WORKS
            // ==========================================

            if (data.howItWorks?.length) {

                await packageDetailsRepository.createHowItWorks(

                    data.howItWorks.map((item) => ({

                        packageId,

                        step: item.step,

                        title: item.title,

                        description:
                            item.description,

                        image:
                            item.image ?? null,

                    })),

                    transaction
                );

            }


            // ==========================================
            // 7. BENEFITS
            // ==========================================

            if (data.benefits?.length) {

                await packageDetailsRepository.createBenefits(

                    data.benefits.map((item) => ({

                        packageId,

                        title: item.title,

                        description: item.description,

                        image:
                            item.image ?? null,

                        sortOrder:
                            item.sortOrder ?? 0,

                    })),

                    transaction
                );

            }


            // ==========================================
            // 8. FAQ
            // ==========================================

            if (data.faqs?.length) {

                await packageDetailsRepository.createFaqs(

                    data.faqs.map((item) => ({

                        packageId,

                        question: item.question,

                        answer: item.answer,

                        sortOrder:
                            item.sortOrder ?? 0,

                    })),

                    transaction
                );

            }


            // ==========================================
            // 9. COMMIT
            // ==========================================

            await transaction.commit();


            return {
                packageId,
                message: "Package details created successfully",
            };

        } catch (error) {

            await transaction.rollback();

            console.error(
                "CREATE PACKAGE DETAILS ERROR =>",
                error
            );

            throw error;
        }
    }

    async get(packageId: string) {

        // -----------------------------------------------
        // Check package
        // -----------------------------------------------

        const packageData =
            await packageRepository.findById(
                packageId
            );

        if (!packageData) {

            throw new AppError(
                "Package not found",
                404
            );

        }


        // -----------------------------------------------
        // Get details
        // -----------------------------------------------

        const details =
            await packageDetailsRepository.findByPackageId(
                packageId
            );


        // -----------------------------------------------
        // Return response
        // -----------------------------------------------

        return {

            package: {
                id: packageData.id,
                name: packageData.name,
                image: packageData.image,
                description: packageData.description,
                defaultPrice: packageData.defaultPrice,
                offerPrice: packageData.offerPrice,
                durationMinutes:
                    packageData.durationMinutes,
            },

            description:
                details.detail?.description ?? null,

            whyChooseUs:
                details.detail?.whyChooseUs ?? null,

            images:
                details.images,

            included:
                details.included,

            excluded:
                details.excluded,

            howItWorks:
                details.howItWorks,

            benefits:
                details.benefits,

            faqs:
                details.faqs,

        };
    }

    async update(
        packageId: string,
        data: any
    ) {

        const transaction =
            await import("../../../database/sequelize")
                .then((module) =>
                    module.default.transaction()
                );


        try {

            // -----------------------------------------------
            // Check package
            // -----------------------------------------------

            const packageData =
                await packageRepository.findById(
                    packageId
                );

            if (!packageData) {

                throw new AppError(
                    "Package not found",
                    404
                );

            }


            // -----------------------------------------------
            // Delete old details
            // -----------------------------------------------

            await packageDetailsRepository.deleteByPackageId(
                packageId,
                transaction
            );


            // -----------------------------------------------
            // Basic details
            // -----------------------------------------------

            await packageDetailsRepository.createDetail(

                {

                    packageId,

                    description:
                        data.description ?? null,

                    whyChooseUs:
                        data.whyChooseUs ?? null,

                },

                transaction
            );


            // -----------------------------------------------
            // Images
            // -----------------------------------------------

            if (data.images?.length) {

                await packageDetailsRepository.createImages(

                    data.images.map(
                        (item: any, index: number) => ({

                            packageId,

                            image: item.image,

                            title:
                                item.title ?? null,

                            sortOrder:
                                item.sortOrder ??
                                index + 1,

                        })
                    ),

                    transaction
                );
            }


            // -----------------------------------------------
            // Included
            // -----------------------------------------------

            if (data.included?.length) {

                await packageDetailsRepository.createIncluded(

                    data.included.map(
                        (item: any, index: number) => ({

                            packageId,

                            title: item.title,

                            description:
                                item.description ?? null,

                            image:
                                item.image ?? null,

                            sortOrder:
                                item.sortOrder ??
                                index + 1,

                        })
                    ),

                    transaction
                );
            }


            // -----------------------------------------------
            // Excluded
            // -----------------------------------------------

            if (data.excluded?.length) {

                await packageDetailsRepository.createExcluded(

                    data.excluded.map(
                        (item: any, index: number) => ({

                            packageId,

                            title: item.title,

                            description:
                                item.description ?? null,

                            image:
                                item.image ?? null,

                            sortOrder:
                                item.sortOrder ??
                                index + 1,

                        })
                    ),

                    transaction
                );
            }


            // -----------------------------------------------
            // How It Works
            // -----------------------------------------------

            if (data.howItWorks?.length) {

                await packageDetailsRepository.createHowItWorks(

                    data.howItWorks.map(
                        (item: any, index: number) => ({

                            packageId,

                            step:
                                item.step ??
                                index + 1,

                            title:
                                item.title,

                            description:
                                item.description,

                            image:
                                item.image ?? null,

                        })
                    ),

                    transaction
                );
            }


            // -----------------------------------------------
            // Benefits
            // -----------------------------------------------

            if (data.benefits?.length) {

                await packageDetailsRepository.createBenefits(

                    data.benefits.map(
                        (item: any, index: number) => ({

                            packageId,

                            title:
                                item.title,

                            description:
                                item.description,

                            image:
                                item.image ?? null,

                            sortOrder:
                                item.sortOrder ??
                                index + 1,

                        })
                    ),

                    transaction
                );
            }


            // -----------------------------------------------
            // FAQs
            // -----------------------------------------------

            if (data.faqs?.length) {

                await packageDetailsRepository.createFaqs(

                    data.faqs.map(
                        (item: any, index: number) => ({

                            packageId,

                            question:
                                item.question,

                            answer:
                                item.answer,

                            sortOrder:
                                item.sortOrder ??
                                index + 1,

                        })
                    ),

                    transaction
                );
            }


            // -----------------------------------------------
            // Commit
            // -----------------------------------------------

            await transaction.commit();


            // -----------------------------------------------
            // Return updated data
            // -----------------------------------------------

            return await this.get(
                packageId
            );

        } catch (error) {

            await transaction.rollback();

            console.error(
                "UPDATE PACKAGE DETAILS ERROR =>",
                error
            );

            throw error;
        }
    }

}

export default new PackageDetailsService();