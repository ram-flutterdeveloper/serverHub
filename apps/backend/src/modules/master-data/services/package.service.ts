import packageRepository from "../repositories/package.repository";
import subCategoryRepository from "../repositories/sub-category.repository";
import { AppError } from "../../../helpers/AppError";

class PackageService {

    async create(body: any) {

        const subCategory = await subCategoryRepository.findById(body.subCategoryId);

        if (!subCategory) {
            throw new AppError("Sub Category not found", 404);
        }

        const exists = await packageRepository.findByName(body.name);

        if (exists) {
            throw new AppError("Package already exists", 400);
        }

        return packageRepository.create({
            ...body,
            slug: body.name.toLowerCase().replace(/\s+/g, "-"),
        });

    }

    async getAll() {
        return packageRepository.findAll();
    }

    async getBySubCategory(subCategoryId: string) {
        return packageRepository.findBySubCategory(subCategoryId);
    }

    async update(id: string, body: any) {
        return packageRepository.update(id, body);
    }

    async delete(id: string) {
        await packageRepository.delete(id);
    }
}

export default new PackageService();