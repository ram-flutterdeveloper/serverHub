import categoryRepository from "../repositories/category.repository";
import { AppError } from "../../../helpers/AppError";

class CategoryService {
  async create(body: any) {
    const exists = await categoryRepository.findByName(body.name);

    if (exists) {
      throw new AppError("Category already exists", 400);
    }

    return categoryRepository.create({
      ...body,
      slug: body.name
        .toLowerCase()
        .replace(/\s+/g, "-"),
    });
  }

  async getAll() {
    return categoryRepository.findAll();
  }

  async update(id: string, body: any) {
    return categoryRepository.update(id, body);
  }

  async delete(id: number) {
    await categoryRepository.delete(id);
  }
}

export default new CategoryService();