import { Package, SubCategory } from "../models";

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

    async findById(id: string) {
        return Package.findByPk(id);
    }

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
    async findPopular() {
        return Package.findAll({
            where: {
                status: "ACTIVE",
                isFeatured: true,
            },
            limit: 10,
            order: [["sortOrder", "ASC"]],
        });
    }
}


export default new PackageRepository();