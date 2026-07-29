import providerRepository from "../repositories/provider.repository";
import providerBankAccountRepository from "../repositories/provider-bank-account.repository";

import { AppError } from "../../../helpers/AppError";

class ProviderBankAccountService{

    async save(userId:string,body:any){

        const provider =
            await providerRepository.findByUserId(userId);

        if(!provider){
            throw new AppError("Provider not found",404);
        }

        const existing =
            await providerBankAccountRepository.findByProvider(
                provider.id
            );

        if(existing){

            return providerBankAccountRepository.update(
                existing.id,
                {
                    ...body,
                    verificationStatus:"PENDING",
                    verifiedAt:null,
                    remarks:null,
                }
            );

        }

        return providerBankAccountRepository.create({

            providerId:provider.id,

            ...body,

        });

    }

    async getMyBankAccount(userId:string){

        const provider =
            await providerRepository.findByUserId(userId);

        if(!provider){
            throw new AppError("Provider not found",404);
        }

        return providerBankAccountRepository.findByProvider(
            provider.id
        );

    }


    async delete(userId: string) {

    const provider =
        await providerRepository.findByUserId(userId);

    if (!provider) {
        throw new AppError("Provider not found", 404);
    }

    const account =
        await providerBankAccountRepository.findByProvider(
            provider.id
        );

    if (!account) {
        throw new AppError(
            "Bank account not found",
            404
        );
    }

    await providerBankAccountRepository.delete(
        account.id
    );

}

async updateBankDetails(
    userId: string,
    body: any
) {

    const provider =
        await providerRepository.findByUserId(userId);

    if (!provider) {
        throw new AppError(
            "Provider not found",
            404
        );
    }

    const account =
        await providerBankAccountRepository.findByProvider(
            provider.id
        );

    if (!account) {
        throw new AppError(
            "Bank account not found",
            404
        );
    }

    return providerBankAccountRepository.update(
        account.id,
        {
            ...body,
            verificationStatus: "PENDING",
            verifiedAt: null,
            remarks: null,
        }
    );

}
}

export default new ProviderBankAccountService();