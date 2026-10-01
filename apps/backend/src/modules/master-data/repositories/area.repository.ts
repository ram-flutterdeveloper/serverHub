import { Area, City } from "../models";

class AreaRepository {
  async create(data: Partial<Area>) {
    return Area.create(data as any);
  }

  async findAll() {
    return Area.findAll({
      include: [
        {
          model: City,
          as: "city",
        },
      ],
      order: [["sortOrder", "ASC"]],
    });
  }

  async findByCity(cityId: string) {
    return Area.findAll({
      where: {
        cityId,
      },
      order: [["sortOrder", "ASC"]],
    });
  }

  

  async findById(id: string) {
    return Area.findByPk(id);
  }

  async findByName(cityId: string, name: string) {
    return Area.findOne({
      where: {
        cityId,
        name,
      },
    });
  }

  async update(id: string, data: Partial<Area>) {
    await Area.update(data, {
      where: { id },
    });

    return this.findById(id);
  }

  async delete(id: string) {
    return Area.destroy({
      where: { id },
    });
  }
}

export default new AreaRepository();