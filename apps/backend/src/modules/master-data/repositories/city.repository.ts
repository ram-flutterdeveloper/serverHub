// import { City } from "../models";

// class CityRepository {
//   async create(data: Partial<City>) {
//     return City.create(data as any);
//   }

//   async findAll() {
//     return City.findAll({
//       order: [["sortOrder", "ASC"]],
//     });
//   }

//   async findById(id: string) {
//     return City.findByPk(id);
//   }

//   async findByName(name: string) {
//     return City.findOne({
//       where: { name },
//     });
//   }

//   async update(id: string, data: Partial<City>) {
//     await City.update(data, {
//       where: { id },
//     });

//     return this.findById(id);
//   }

//   async delete(id: string) {
//     return City.destroy({
//       where: { id },
//     });
//   }
// }

// export default new CityRepository();

import { City } from "../models";
import { Op } from "sequelize";

class CityRepository {

  async create(data: Partial<City>) {
    return City.create(data as any);
  }

  async findAll() {
    return City.findAll({
      where: {
        status: "ACTIVE",
      },
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

  async findNearestCity(
    latitude: number,
    longitude: number
  ) {

    const cities = await City.findAll({
      where: {
        status: "ACTIVE",
        latitude: {
          [Op.ne]: null,
        },
        longitude: {
          [Op.ne]: null,
        },
      },
    });

    if (!cities.length) {
      return null;
    }

    let nearestCity = cities[0];
    let shortestDistance = Number.MAX_VALUE;

    for (const city of cities) {

      if (
        city.latitude === null ||
        city.longitude === null
      ) {
        continue;
      }

      const distance =
        this.calculateDistance(
          latitude,
          longitude,
          city.latitude,
          city.longitude
        );

      if (distance < shortestDistance) {
        shortestDistance = distance;
        nearestCity = city;
      }
    }

    return {
      city: nearestCity,
      distance: Number(
        shortestDistance.toFixed(2)
      ),
    };
  }

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) {

    const R = 6371;

    const dLat =
      this.toRad(lat2 - lat1);

    const dLon =
      this.toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) *
      Math.sin(dLat / 2) +

      Math.cos(this.toRad(lat1)) *
      Math.cos(this.toRad(lat2)) *

      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

    const c =
      2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      );

    return R * c;
  }

  private toRad(value: number) {
    return value * Math.PI / 180;
  }

  async update(
    id: string,
    data: Partial<City>
  ) {

    const [updatedCount] =
      await City.update(
        data,
        {
          where: {
            id,
          },
        }
      );

    if (updatedCount === 0) {
      return null;
    }

    return this.findById(id);
  }

  async delete(id: string) {
    return City.destroy({
      where: { id },
    });
  }

  async findActiveByIds(cityIds: string[]) {

    return City.findAll({
      where: {
        id: {
          [Op.in]: cityIds,
        },

        status: "ACTIVE",
      },
    });

  }

  async findByNameExceptId(
    name: string,
    id: string
  ) {
    return City.findOne({
      where: {
        name: name.trim(),

        id: {
          [Op.ne]: id,
        },
      },

      paranoid: true,
    });
  }
}

export default new CityRepository();