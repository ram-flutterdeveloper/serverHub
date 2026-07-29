import providerRepository from "../repositories/provider.repository";
import providerLocationRepository from "../repositories/provider-location.repository";
import { AppError } from "../../../helpers/AppError";

class ProviderLocationService {

    async save(userId: string, body: any) {

        const provider = await providerRepository.findByUserId(userId);

        if (!provider) {
            throw new AppError("Provider not found", 404);
        }

        const existing = await providerLocationRepository.findByProvider(
            provider.id
        );

        if (existing) {
            return providerLocationRepository.update(
                existing.id,
                body
            );
        }

        return providerLocationRepository.create({
            providerId: provider.id,
            ...body,
        });

    }

    async getMyLocation(userId: string) {

        const provider = await providerRepository.findByUserId(userId);

        if (!provider) {
            throw new AppError("Provider not found", 404);
        }

        return providerLocationRepository.findByProvider(provider.id);

    }
}

export default new ProviderLocationService();