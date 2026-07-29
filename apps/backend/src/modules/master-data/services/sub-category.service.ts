import subCategoryRepository from "../repositories/sub-category.repository";
import serviceRepository from "../repositories/service.repository";
import { AppError } from "../../../helpers/AppError";

class SubCategoryService {
  async create(body: any) {
    // Check Service exists
    const service = await serviceRepository.findById(body.serviceId);

    if (!service) {
      throw new AppError("Service not found", 404);
    }

    // Prevent duplicate subcategory in same service
    const exists =
      await subCategoryRepository.findByNameAndService(
        body.name,
        body.serviceId
      );

    if (exists) {
      throw new AppError(
        "Sub Category already exists for this service",
        400
      );
    }

    return subCategoryRepository.create({
      ...body,
      slug: body.name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-"),
    });
  }

  async getAll() {
    return subCategoryRepository.findAll();
  }

  async getByService(serviceId: string) {
    const service = await serviceRepository.findById(serviceId);

    if (!service) {
      throw new AppError("Service not found", 404);
    }

    return subCategoryRepository.findByService(serviceId);
  }

  async update(id: string, body: any) {
    const subCategory = await subCategoryRepository.findById(id);

    if (!subCategory) {
      throw new AppError("Sub Category not found", 404);
    }

    return subCategoryRepository.update(id, {
      ...body,
      slug: body.name
        ? body.name
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
        : subCategory.slug,
    });
  }

  async delete(id: string) {
    const subCategory = await subCategoryRepository.findById(id);

    if (!subCategory) {
      throw new AppError("Sub Category not found", 404);
    }

    await subCategoryRepository.delete(id);
  }
}

export default new SubCategoryService();