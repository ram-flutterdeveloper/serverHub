import { Category, Package, Service, SubCategory } from "../models";
import ServiceCity from "../models/service-city.model";

class PackageRepository {

    async create(data: Partial<Package>) {
        return Package.create(data as any);
    }

    async findAll() {
        return Package.findAll({
            include: [
                {
                    model: SubCategory,
                    as: "subCategory",
                },
            ],
            order: [["sortOrder", "ASC"]],
        });
    }

    async findBySubCategory(subCategoryId: string) {
        return Package.findAll({
            where: {
                subCategoryId,
            },
            order: [["sortOrder", "ASC"]],
        });
    }

    // async findById(id: string) {
    //     return Package.findByPk(id);
    // }

    //     async findById(id: string) {
    //   return Package.findByPk(id, {
    //     include: [
    //       {
    //         model: SubCategory,
    //         as: "subCategory",
    //         include: [
    //           {
    //             model: Category,
    //             as: "category",
    //           },
    //         ],
    //       },
    //     ],
    //   });
    // }

    async findById(id: string) {
        return Package.findByPk(id, {
            include: [
                // Direct Service
                {
                    model: Service,
                    as: "service",
                    required: true,
                    include: [
                        {
                            model: Category,
                            as: "category",
                            required: true,
                        },
                    ],
                },

                // Optional SubCategory
                {
                    model: SubCategory,
                    as: "subCategory",
                    required: false,
                    include: [
                        {
                            model: Service,
                            as: "service",
                            required: false,
                            include: [
                                {
                                    model: Category,
                                    as: "category",
                                    required: false,
                                },
                            ],
                        },
                    ],
                },
            ],
        });
    }

    // async findById(id: string) {
    //     return Package.findByPk(id, {
    //         include: [
    //             {
    //                 model: SubCategory,
    //                 as: "subCategory",
    //                 include: [
    //                     {
    //                         model: Service,
    //                         as: "service",
    //                         include: [
    //                             {
    //                                 model: Category,
    //                                 as: "category",
    //                             },
    //                         ],
    //                     },
    //                 ],
    //             },
    //         ],
    //     });
    // }
    async findByName(name: string) {
        return Package.findOne({
            where: {
                name,
            },
        });
    }

    async update(id: string, data: Partial<Package>) {
        await Package.update(data, {
            where: { id },
        });

        return this.findById(id);
    }

    async delete(id: string) {
        return Package.destroy({
            where: { id },
        });
    }

    async findPopular(cityId: string) {
        return Package.findAll({
            where: {
                status: "ACTIVE",
                isFeatured: true,
            },

            include: [
                {
                    model: Service,
                    as: "service",

                    where: {
                        status: "ACTIVE",
                    },

                    required: true,

                    include: [
                        {
                            model: ServiceCity,
                            as: "serviceCities",

                            where: {
                                cityId,
                                status: "ACTIVE",
                            },

                            required: true,
                        },
                    ],
                },
            ],

            limit: 10,

            order: [
                ["sortOrder", "ASC"],
            ],
        });
    }

    async findByService(
        serviceId: string
    ) {

        return Package.findAll({

            where: {
                serviceId,
                status: "ACTIVE",
            },

            include: [
                {
                    model: SubCategory,
                    as: "subCategory",
                    required: false,
                },
            ],

            order: [
                ["sortOrder", "ASC"],
            ],

        });

    }
}


export default new PackageRepository();