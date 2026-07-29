import { ProviderWorkingHour } from "../models";

class ProviderWorkingHourRepository {

    async create(data: Partial<ProviderWorkingHour>) {
        return ProviderWorkingHour.create(data as any);
    }

    async findByProvider(providerId: string) {
        return ProviderWorkingHour.findAll({
            where: { providerId },
            order: [["dayOfWeek", "ASC"]],
        });
    }

    async findOne(providerId: string, dayOfWeek: string) {
        return ProviderWorkingHour.findOne({
            where: {
                providerId,
                dayOfWeek,
            },
        });
    }

    async findById(id: string) {
        return ProviderWorkingHour.findByPk(id);
    }

    async update(id: string, data: Partial<ProviderWorkingHour>) {
        await ProviderWorkingHour.update(data, {
            where: { id },
        });

        return this.findById(id);
    }

    async delete(id: string) {
        return ProviderWorkingHour.destroy({
            where: { id },
        });
    }
}

export default new ProviderWorkingHourRepository();