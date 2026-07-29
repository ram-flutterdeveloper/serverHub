import { Op } from "sequelize";
import { SubCategory, Service } from "../models";

class SubCategoryRepository {
  async create(data: Partial<SubCategory>) {
    return SubCategory.create(data as any);
  }

  async findAll() {
    return SubCategory.findAll({
      include: [
        {
          model: Service,
          as: "service",
        },
      ],
      order: [["sortOrder", "ASC"]],
    });
  }

  async findByService(serviceId: string) {
    return SubCategory.findAll({
      where: {
        serviceId,
      },
      order: [["sortOrder", "ASC"]],
    });
  }

  async findById(id: string) {
    return SubCategory.findByPk(id);
  }

  async findByNameAndService(name: string, serviceId: string) {
    return SubCategory.findOne({
      where: {
        name,
        serviceId,
      },
    });
  }

  async update(id: string, data: Partial<SubCategory>) {
    await SubCategory.update(data, {
      where: {
        id,
      },
    });

    return this.findById(id);
  }

  async delete(id: string) {
    return SubCategory.destroy({
      where: {
        id,
      },
    });
  }

  
}

export default new SubCategoryRepository();