import { AppError } from "../../../../helpers/AppError";
import providerRepository from "../repositories/provider.repository";


class ProviderService {

    async dashboard() {
        return providerRepository.getDashboardStats();
    }

    async getProviders(query: any) {

        const page = Number(query.page) || 1;

        const limit = Number(query.limit) || 10;

        return providerRepository.getProviders({

            page,

            limit,

            search: query.search,

            status: query.status,

        });

    }

    async getProvider(id: string) {

        const provider =
            await providerRepository.getProviderById(id);

        if (!provider) {
            throw new AppError(
                "Provider not found",
                404
            );
        }

        return provider;
    }

    async approve(id: string) {

        await this.getProvider(id);

        await providerRepository.updateStatus(
            id,
            "ACTIVE"
        );

        return {
            message: "Provider approved successfully"
        };
    }

    async reject(id: string) {

        await this.getProvider(id);

        await providerRepository.updateStatus(
            id,
            "REJECTED"
        );

        return {
            message: "Provider rejected successfully"
        };
    }

    // async suspend(id: string) {

    //     await this.getProvider(id);

    //     await providerRepository.updateStatus(
    //         id,
    //         "SUSPENDED"
    //     );

    //     return {
    //         message: "Provider suspended successfully"
    //     };
    // }

    async suspend(id: string) {

    const provider = await this.getProvider(id);

    await providerRepository.updateStatus(id, "SUSPENDED");

    await providerRepository.updateUserStatus(
        provider.userId,
        "BLOCKED"
    );

    return {
        message: "Provider suspended successfully"
    };
}

    async activate(id: string) {

        await this.getProvider(id);

        await providerRepository.updateStatus(
            id,
            "ACTIVE"
        );

        return {
            message: "Provider activated successfully"
        };
    }

    async verifyKyc(id: string) {

        await this.getProvider(id);

        await providerRepository.updateKycStatus(
            id,
            // "VERIFIED"
        );

        return {
            message: "KYC verified successfully"
        };
    }

    async updateCommission(
        id: string,
        commission: number
    ) {

        await this.getProvider(id);

        await providerRepository.updateCommission(
            id,
            commission
        );

        return {
            message: "Commission updated successfully"
        };
    }

}

export default new ProviderService();