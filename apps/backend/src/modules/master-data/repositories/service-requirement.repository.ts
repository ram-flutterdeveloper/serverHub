import { Package, ServiceRequirement } from "../models";

class ServiceRequirementRepository {
  async create(data: Partial<ServiceRequirement>) {
    return ServiceRequirement.create(data as any);
  }

  async findByPackage(packageId: string) {
    return ServiceRequirement.findAll({
      where: { packageId },
      order: [["sortOrder", "ASC"]],
    });
  }

  async findAll() {
    return ServiceRequirement.findAll({
      include: [
        {
          model: Package,
          as: "package",
        },
      ],
    });
  }

  async findById(id: string) {
    return ServiceRequirement.findByPk(id);
  }

  async delete(id: string) {
    return ServiceRequirement.destroy({
      where: { id },
    });
  }
}

export default new ServiceRequirementRepository();