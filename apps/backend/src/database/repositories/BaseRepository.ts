import { Model, ModelStatic } from "sequelize";

export class BaseRepository<T extends Model> {
  constructor(protected readonly model: ModelStatic<T>) {}

  async findAll() {
    return this.model.findAll();
  }

  async findById(id: string) {
    return this.model.findByPk(id);
  }

  async create(data: any) {
    return this.model.create(data);
  }

  async update(id: string, data: any) {
    const record = await this.findById(id);

    if (!record) return null;

    return record.update(data);
  }

  async delete(id: string) {
    const record = await this.findById(id);

    if (!record) return null;

    return record.destroy();
  }
}