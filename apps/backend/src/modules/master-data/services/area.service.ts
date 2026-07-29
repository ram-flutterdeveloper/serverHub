import areaRepository from "../repositories/area.repository";
import cityRepository from "../repositories/city.repository";
import { AppError } from "../../../helpers/AppError";

class AreaService {
  async create(body: any) {
    const city = await cityRepository.findById(body.cityId);

    if (!city) {
      throw new AppError("City not found", 404);
    }

    const exists = await areaRepository.findByName(
      body.cityId,
      body.name
    );

    if (exists) {
      throw new AppError("Area already exists in this city", 400);
    }

    return areaRepository.create({
      ...body,
      slug: body.name.toLowerCase().replace(/\s+/g, "-"),
    });
  }

  async getAll() {
    return areaRepository.findAll();
  }

  async getByCity(cityId: string) {
    return areaRepository.findByCity(cityId);
  }

  async update(id: string, body: any) {
    return areaRepository.update(id, body);
  }

  async delete(id: string) {
    await areaRepository.delete(id);
  }
}

export default new AreaService();