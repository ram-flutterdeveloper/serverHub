import { UserAddress } from "../models";
import { City, Area } from "../../master-data/models";

class AddressRepository {

  async create(data: Partial<UserAddress>) {
    return UserAddress.create(data as any);
  }

  async getByUser(userId: string) {
    return UserAddress.findAll({
      where: {
        userId,
        status: "ACTIVE",
      },
      include: [
        {
          model: City,
          as: "city",
        },
        {
          model: Area,
          as: "area",
        },
      ],
      order: [
        ["isDefault", "DESC"],
        ["createdAt", "DESC"],
      ],
    });
  }

  async getById(id: string) {
    return UserAddress.findByPk(id, {
      include: [
        {
          model: City,
          as: "city",
        },
        {
          model: Area,
          as: "area",
        },
      ],
    });
  }

  async update(
    id: string,
    data: Partial<UserAddress>
  ) {
    await UserAddress.update(data, {
      where: {
        id,
      },
    });

    return this.getById(id);
  }

  async delete(id: string) {
    return UserAddress.destroy({
      where: {
        id,
      },
    });
  }

  async removeDefault(userId: string) {
    return UserAddress.update(
      {
        isDefault: false,
      },
      {
        where: {
          userId,
        },
      }
    );
  }

  async setDefault(id: string) {
    return UserAddress.update(
      {
        isDefault: true,
      },
      {
        where: {
          id,
        },
      }
    );
  }

}

export default new AddressRepository();