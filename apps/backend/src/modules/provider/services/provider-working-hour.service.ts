import providerRepository from "../repositories/provider.repository";
import providerWorkingHourRepository from "../repositories/provider-working-hour.repository";

import { AppError } from "../../../helpers/AppError";

class ProviderWorkingHourService {
    async save(userId: string, body: any) {

        const provider = await providerRepository.findByUserId(userId);

        if (!provider) {
            throw new AppError("Provider not found", 404);
        }

        const existing =
            await providerWorkingHourRepository.findOne(
                provider.id,
                body.dayOfWeek
            );

        if (existing) {

            return providerWorkingHourRepository.update(
                existing.id,
                body
            );

        }

        return providerWorkingHourRepository.create({
            providerId: provider.id,
            ...body,
        });

    }
    async getMyWorkingHours(userId: string) {

        const provider = await providerRepository.findByUserId(userId);

        if (!provider) {
            throw new AppError("Provider not found", 404);
        }

        return providerWorkingHourRepository.findByProvider(
            provider.id
        );

    }
    async delete(userId: string, id: string) {

        const provider = await providerRepository.findByUserId(userId);

        if (!provider) {
            throw new AppError("Provider not found", 404);
        }

        const workingHour =
            await providerWorkingHourRepository.findById(id);

        if (!workingHour) {
            throw new AppError("Working hour not found", 404);
        }

        if (workingHour.providerId !== provider.id) {
            throw new AppError("Unauthorized", 403);
        }

        await providerWorkingHourRepository.delete(id);

    }
}
export default new ProviderWorkingHourService();