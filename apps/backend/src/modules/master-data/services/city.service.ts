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

  async update(
    id: string,
    body: any
  ) {

    const city =
      await cityRepository.findById(id);

    if (!city) {
      throw new AppError(
        "City not found",
        404
      );
    }

    const updateData: any = {
      ...body,
    };

    if (body.name) {
      updateData.name =
        body.name.trim();

      updateData.slug =
        body.name
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "-");
    }

    return cityRepository.update(
      id,
      updateData
    );
  }
  async delete(id: string) {
    await cityRepository.delete(id);
  }
}

export default new CityService();