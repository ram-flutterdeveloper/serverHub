import providerRepository from "../repositories/provider.repository";
import providerWorkingHourRepository from "../repositories/provider-working-hour.repository";

import { AppError } from "../../../helpers/AppError";
import authRepository from "../../auth/repositories/auth.repository";

class ProviderWorkingHourService {
    async save(userId: string, body: any) {

        const provider =
            await providerRepository.findByUserId(userId);

        if (!provider) {
            throw new AppError(
                "Provider not found",
                404
            );
        }

        const workingHours = body.workingHours;

        if (
            !Array.isArray(workingHours) ||
            workingHours.length === 0
        ) {
            throw new AppError(
                "Working hours are required",
                400
            );
        }

        const results = [];

        for (const item of workingHours) {

            const existing =
                await providerWorkingHourRepository.findOne(
                    provider.id,
                    item.dayOfWeek
                );

            if (existing) {

                const updated =
                    await providerWorkingHourRepository.update(
                        existing.id,
                        item
                    );

                results.push(updated);

            } else {

                const created =
                    await providerWorkingHourRepository.create({
                        providerId: provider.id,
                        ...item,
                    });

                results.push(created);
            }
        }

        // Complete signup step 4
        await authRepository.updateUser(
            userId,
            {
                providerSignupStep: 4,
            }
        );

        return results;
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

    async update(
        userId: string,
        id: string,
        body: any
    ) {

        const provider =
            await providerRepository.findByUserId(
                userId
            );

        if (!provider) {
            throw new AppError(
                "Provider not found",
                404
            );
        }


        const workingHour =
            await providerWorkingHourRepository.findById(
                id
            );

        if (!workingHour) {
            throw new AppError(
                "Working hour not found",
                404
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Security
        |--------------------------------------------------------------------------
        | Make sure this working hour belongs
        | to the logged-in provider.
        |--------------------------------------------------------------------------
        */

        if (
            workingHour.providerId !==
            provider.id
        ) {
            throw new AppError(
                "Unauthorized",
                403
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Update
        |--------------------------------------------------------------------------
        */

        const updated =
            await providerWorkingHourRepository.update(
                id,
                {
                    isOpen: body.isOpen,
                    openTime: body.openTime,
                    closeTime: body.closeTime,
                }
            );


        return updated;
    }
}
export default new ProviderWorkingHourService();