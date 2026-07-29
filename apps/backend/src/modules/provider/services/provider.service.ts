import providerRepository from "../repositories/provider.repository";
import { AppError } from "../../../helpers/AppError";

class ProviderService {

    async register(userId: string, body: any) {

        const exists = await providerRepository.findByUserId(userId);

        if (exists) {
            throw new AppError(
                "Provider profile already exists",
                400
            );
        }

        return providerRepository.create({
            userId,
            ...body,
        });

    }

    async getMyProfile(userId: string) {
        return providerRepository.findByUserId(userId);
    }

    async updateMyProfile(userId: string, body: any) {

        const provider = await providerRepository.findByUserId(userId);

        if (!provider) {
            throw new AppError("Provider not found", 404);
        }

        return providerRepository.update(
            provider.id,
            body
        );
    }
    async getById(id: string) {
        const provider = await providerRepository.findById(id);

        if (!provider) {
            throw new AppError("Provider not found", 404);
        }

        return provider;
    }

}

export default new ProviderService();