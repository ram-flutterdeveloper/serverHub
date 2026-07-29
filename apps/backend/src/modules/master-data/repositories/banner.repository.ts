import { Banner } from "../models";

class BannerRepository {

    async create(data: Partial<Banner>) {
        return Banner.create(data as any);
    }

    async findAll() {
        return Banner.findAll({
            order: [["sortOrder", "ASC"]],
        });
    }

    async findHomeBanners() {
        return Banner.findAll({
            where: {
                bannerType: "HOME",
                status: "ACTIVE",
            },
            order: [["sortOrder", "ASC"]],
        });
    }

    async findById(id: string) {
        return Banner.findByPk(id);
    }

    async update(id: string, data: Partial<Banner>) {
        await Banner.update(data, {
            where: { id },
        });

        return this.findById(id);
    }

    async delete(id: string) {
        return Banner.destroy({
            where: { id },
        });
    }
}

export default new BannerRepository();