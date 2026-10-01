import { Service } from "../models";
import Category from "../models/Category.model";
import ServiceCity from "../models/service-city.model";


class CategoryRepository {
  async create(data: Partial<Category>) {
    return Category.create(data as any);
  }

  async findAll() {
    return Category.findAll({
      order: [["sortOrder", "ASC"]],
    });
  }

  async findById(id: string) {
    return Category.findByPk(id);
  }

  async findByName(name: string) {
    return Category.findOne({
      where: { name },
    });
  }

  async update(id: string, data: Partial<Category>) {
    await Category.update(data, {
      where: { id },
    });

    return this.findById(id);
  }

  async delete(id: number) {
    return Category.destroy({
      where: { id },
    });
  }
//   async findAllWithServices() {
//   return Category.findAll({
//     where: {
//       status: "ACTIVE",
//     },
//     include: [
//       {
//         model: Service,
//         as: "services",
//         where: {
//           status: "ACTIVE",
//         },
//         required: false,
//       },
//     ],
//     order: [
//       ["sortOrder", "ASC"],
//       [{ model: Service, as: "services" }, "sortOrder", "ASC"],
//     ],
//   });
// }


async findAllWithServices(cityId: string) {
  return Category.findAll({
    where: {
      status: "ACTIVE",
    },

    include: [
      {
        model: Service,
        as: "services",

        where: {
          status: "ACTIVE",
        },

        required: true,

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
        ],
      },
    ],

    order: [
      ["sortOrder", "ASC"],
      [
        { model: Service, as: "services" },
        "sortOrder",
        "ASC",
      ],
    ],
  });
}
}

export default new CategoryRepository();