import serviceRepository from "../repositories/service.repository";
import categoryRepository from "../repositories/category.repository";
import { AppError } from "../../../helpers/AppError";

class ServiceService {
  async create(body: any) {
    const category = await categoryRepository.findById(body.categoryId);

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    const exists = await serviceRepository.findByName(body.name);

    if (exists) {
      throw new AppError("Service already exists", 400);
    }

    return serviceRepository.create({
      ...body,
      slug: body.name.toLowerCase().replace(/\s+/g, "-"),
    });
  }

  async getAll() {
    return serviceRepository.findAll();
  }

  async getByCategory(categoryId: string) {
    return serviceRepository.findByCategory(categoryId);
  }

  async update(id: string, body: any) {
    return serviceRepository.update(id, body);
  }

  async delete(id: string) {
    await serviceRepository.delete(id);
  }
}

export default new ServiceService();