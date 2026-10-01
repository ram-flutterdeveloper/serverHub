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

    async update(
        id: string,
        data: Partial<ProviderWorkingHour>
    ) {

        await ProviderWorkingHour.update(
            data,
            {
                where: { id },
            }
        );

        return this.findById(id);
    }

    async delete(id: string) {
        return ProviderWorkingHour.destroy({
            where: { id },
        });
    }


    async getAvailableSlots(serviceId: string) {
        return [
            {
                startTime: "09:00",
                endTime: "11:00",
            },
            {
                startTime: "11:00",
                endTime: "01:00",
            },
            {
                startTime: "02:00",
                endTime: "04:00",
            },
            {
                startTime: "04:00",
                endTime: "06:00",
            },
        ];
    }

}

export default new ProviderWorkingHourRepository();