import { ProviderDocument } from "../models";

class ProviderDocumentRepository {

    async create(data: Partial<ProviderDocument>) {
        return ProviderDocument.create(data as any);
    }

    async findByProvider(providerId: string) {
        return ProviderDocument.findAll({
            where: { providerId },
            order: [["createdAt", "DESC"]],
        });
    }

    async findById(id: string) {
        return ProviderDocument.findByPk(id);
    }

    async findByType(
        providerId: string,
        documentType: string
    ) {
        return ProviderDocument.findOne({
            where: {
                providerId,
                documentType,
            },
        });
    }

    async update(
        id: string,
        data: Partial<ProviderDocument>
    ) {
        await ProviderDocument.update(data, {
            where: { id },
        });

        return this.findById(id);
    }

    async delete(id: string) {
        return ProviderDocument.destroy({
            where: { id },
        });
    }
}

export default new ProviderDocumentRepository();