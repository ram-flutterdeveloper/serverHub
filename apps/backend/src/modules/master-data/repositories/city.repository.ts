import { City } from "../models";

class CityRepository {
  async create(data: Partial<City>) {
    return City.create(data as any);
  }

  async findAll() {
    return City.findAll({
      order: [["sortOrder", "ASC"]],
    });
  }

  async findById(id: string) {
    return City.findByPk(id);
  }

  async findByName(name: string) {
    return City.findOne({
      where: { name },
    });
  }

  async update(id: string, data: Partial<City>) {
    await City.update(data, {
      where: { id },
    });

    return this.findById(id);
  }

  async delete(id: string) {
    return City.destroy({
      where: { id },
    });
  }
}

export default new CityRepository();