
import {
    Provider,
    ProviderLocation,
    ProviderService,
    ProviderDocument,
    ProviderBankAccount,
    ProviderWorkingHour,
} from "../models";

class ProviderRepository {

  async create(data: Partial<Provider>) {
    return Provider.create(data as any);
  }

  async findByUserId(userId: string) {
    return Provider.findOne({
      where: { userId },
    });
  }
  async findAll() {

    return Provider.findAll({

        order: [
            ["createdAt", "DESC"],
        ],

    });

}

  async findById(id: string) {
    return Provider.findByPk(id);
  }

  async update(id: string, data: Partial<Provider>) {
    await Provider.update(data, {
      where: { id },
    });

    return this.findById(id);
  }

}

export default new ProviderRepository();