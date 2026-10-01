import { Service, Category } from "../models";
import ServiceCity from "../models/service-city.model";

class ServiceRepository {
  async create(data: Partial<Service>) {
    return Service.create(data as any);
  }

  async findAll() {
    return Service.findAll({
      include: [
        {
          model: Category,
          as: "category",
        },
      ],
      order: [["sortOrder", "ASC"]],
    });
  }

  async findByCategory(categoryId: string) {
    return Service.findAll({
      where: {
        categoryId,
      },
      order: [["sortOrder", "ASC"]],
    });
  }

  async findById(id: string) {
    return Service.findByPk(id);
  }

  async findByName(name: string) {
    return Service.findOne({
      where: { name },
    });
  }

  async update(id: string, data: Partial<Service>) {
    await Service.update(data, {
      where: { id },
    });

    return this.findById(id);
  }

  async delete(id: string) {
    return Service.destroy({
      where: { id },
    });
  }
  // async findFeatured() {
  //   return Service.findAll({
  //     where: {
  //       status: "ACTIVE",
  //       isFeatured: true,
  //     },
  //     limit: 10,
  //     order: [["sortOrder", "ASC"]],
  //   });
  // }

  async findFeatured(cityId: string) {
  return Service.findAll({
    where: {
      status: "ACTIVE",
      isFeatured: true,
    },

    include: [
      {
        model: ServiceCity,
        as: "serviceCities",

        where: {
          cityId,
          status: "ACTIVE",
        },

        required: true,
      },

      {
        model: Category,
        as: "category",
        where: {
          status: "ACTIVE",
        },

        required: true,
      },
    ],

    limit: 10,

    order: [
      ["sortOrder", "ASC"],
    ],
  });
}


}

export default new ServiceRepository();