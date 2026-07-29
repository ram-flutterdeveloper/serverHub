import providerRepository from "../repositories/provider.repository";
import providerDocumentRepository from "../repositories/provider-document.repository";

import { AppError } from "../../../helpers/AppError";

class ProviderDocumentService {

    async upload(
        userId: string,
        body: any,
        files: any
    ) {

        const provider =
            await providerRepository.findByUserId(userId);

        if (!provider) {
            throw new AppError(
                "Provider not found",
                404
            );
        }

        const existing =
            await providerDocumentRepository.findByType(
                provider.id,
                body.documentType
            );

        const frontImage =
            files?.frontImage?.[0]?.filename ?? null;

        const backImage =
            files?.backImage?.[0]?.filename ?? null;

        if (existing) {

            return providerDocumentRepository.update(
                existing.id,
                {
                    documentNumber: body.documentNumber,
                    frontImage:
                        frontImage ?? existing.frontImage,
                    backImage:
                        backImage ?? existing.backImage,
                    status: "PENDING",
                    verifiedAt: null,
                    verifiedBy: null,
                    remarks: null,
                }
            );

        }

        return providerDocumentRepository.create({

            providerId: provider.id,

            documentType: body.documentType,

            documentNumber: body.documentNumber,

            frontImage,

            backImage,

        });

    }

    async getMyDocuments(userId: string) {

        const provider =
            await providerRepository.findByUserId(userId);

        if (!provider) {
            throw new AppError(
                "Provider not found",
                404
            );
        }

        return providerDocumentRepository.findByProvider(
            provider.id
        );

    }

    async delete(userId: string, id: string) {

        const provider =
            await providerRepository.findByUserId(userId);

        if (!provider) {
            throw new AppError(
                "Provider not found",
                404
            );
        }

        const document =
            await providerDocumentRepository.findById(id);

        if (!document) {
            throw new AppError(
                "Document not found",
                404
            );
        }

        if (document.providerId !== provider.id) {
            throw new AppError(
                "Unauthorized",
                403
            );
        }

        await providerDocumentRepository.delete(id);

    }

}

export default new ProviderDocumentService();