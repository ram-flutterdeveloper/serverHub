import { ProviderService } from "../models";
import { Service } from "../../master-data/models";

class ProviderServiceRepository {

    async create(data: Partial<ProviderService>) {
        return ProviderService.create(data as any);
    }

    async findByProvider(providerId: string) {
        return ProviderService.findAll({
            where: { providerId },
            include: [
                {
                    model: Service,
                    as: "service",
                },
            ],
        });
    }

    async findOne(providerId: string, serviceId: string) {
        return ProviderService.findOne({
            where: {
                providerId,
                serviceId,
            },
        });
    }

    async delete(id: string) {
        return ProviderService.destroy({
            where: { id },
        });
    }

    async findById(id: string) {
    return ProviderService.findByPk(id);
}
}

export default new ProviderServiceRepository();