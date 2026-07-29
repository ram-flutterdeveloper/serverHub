import cityRepository from "../repositories/city.repository";
import { AppError } from "../../../helpers/AppError";

class CityService {
  async create(body: any) {
    const exists = await cityRepository.findByName(body.name);

    if (exists) {
      throw new AppError("City already exists", 400);
    }

    return cityRepository.create({
      ...body,
      slug: body.name.toLowerCase().replace(/\s+/g, "-"),
    });
  }

  async getAll() {
    return cityRepository.findAll();
  }

  async update(id: string, body: any) {
    return cityRepository.update(id, body);
  }

  async delete(id: string) {
    await cityRepository.delete(id);
  }
}

export default new CityService();