import { ProviderLocation } from "../models";

class ProviderLocationRepository {

    async create(data: Partial<ProviderLocation>) {
        return ProviderLocation.create(data as any);
    }

    async findByProvider(providerId: string) {
        return ProviderLocation.findOne({
            where: {
                providerId,
                isPrimary: true,
            },
        });
    }

    async update(id: string, data: Partial<ProviderLocation>) {
        await ProviderLocation.update(data, {
            where: { id },
        });

        return ProviderLocation.findByPk(id);
    }
}

export default new ProviderLocationRepository();