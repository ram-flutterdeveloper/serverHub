import PackageDetail from "../models/package-detail.model";
import PackageImage from "../models/package-image.model";
import PackageIncluded from "../models/package-included.model";
import PackageExcluded from "../models/package-excluded.model";
import PackageHowItWorks from "../models/package-how-it-works.model";
import PackageBenefit from "../models/package-benefit.model";
import PackageFaq from "../models/package-faq.model";

class PackageDetailsRepository {

  async createDetail(
    data: Partial<PackageDetail>,
    transaction: any
  ) {
    return PackageDetail.create(data as any, {
      transaction,
    });
  }

  async createImages(
    data: Partial<PackageImage>[],
    transaction: any
  ) {
    if (!data.length) return [];

    return PackageImage.bulkCreate(data as any, {
      transaction,
    });
  }

  async createIncluded(
    data: Partial<PackageIncluded>[],
    transaction: any
  ) {
    if (!data.length) return [];

    return PackageIncluded.bulkCreate(data as any, {
      transaction,
    });
  }

  async createExcluded(
    data: Partial<PackageExcluded>[],
    transaction: any
  ) {
    if (!data.length) return [];

    return PackageExcluded.bulkCreate(data as any, {
      transaction,
    });
  }

  async createHowItWorks(
    data: Partial<PackageHowItWorks>[],
    transaction: any
  ) {
    if (!data.length) return [];

    return PackageHowItWorks.bulkCreate(data as any, {
      transaction,
    });
  }

  async createBenefits(
    data: Partial<PackageBenefit>[],
    transaction: any
  ) {
    if (!data.length) return [];

    return PackageBenefit.bulkCreate(data as any, {
      transaction,
    });
  }

  async createFaqs(
    data: Partial<PackageFaq>[],
    transaction: any
  ) {
    if (!data.length) return [];

    return PackageFaq.bulkCreate(data as any, {
      transaction,
    });
  }

 async findByPackageId(packageId: string) {

    const [
      detail,
      images,
      included,
      excluded,
      howItWorks,
      benefits,
      faqs,
    ] = await Promise.all([

      PackageDetail.findOne({
        where: {
          packageId,
        },
      }),

      PackageImage.findAll({
        where: {
          packageId,
        },
        order: [
          ["sortOrder", "ASC"],
        ],
      }),

      PackageIncluded.findAll({
        where: {
          packageId,
        },
        order: [
          ["sortOrder", "ASC"],
        ],
      }),

      PackageExcluded.findAll({
        where: {
          packageId,
        },
        order: [
          ["sortOrder", "ASC"],
        ],
      }),

      PackageHowItWorks.findAll({
        where: {
          packageId,
        },
        order: [
          ["step", "ASC"],
        ],
      }),

      PackageBenefit.findAll({
        where: {
          packageId,
        },
        order: [
          ["sortOrder", "ASC"],
        ],
      }),

      PackageFaq.findAll({
        where: {
          packageId,
        },
        order: [
          ["sortOrder", "ASC"],
        ],
      }),

    ]);

    return {
      detail,
      images,
      included,
      excluded,
      howItWorks,
      benefits,
      faqs,
    };
  }
 async deleteByPackageId(
    packageId: string,
    transaction: any
  ) {

    await Promise.all([

      PackageDetail.destroy({
        where: {
          packageId,
        },
        transaction,
      }),

      PackageImage.destroy({
        where: {
          packageId,
        },
        transaction,
      }),

      PackageIncluded.destroy({
        where: {
          packageId,
        },
        transaction,
      }),

      PackageExcluded.destroy({
        where: {
          packageId,
        },
        transaction,
      }),

      PackageHowItWorks.destroy({
        where: {
          packageId,
        },
        transaction,
      }),

      PackageBenefit.destroy({
        where: {
          packageId,
        },
        transaction,
      }),

      PackageFaq.destroy({
        where: {
          packageId,
        },
        transaction,
      }),

    ]);
  }




}

export default new PackageDetailsRepository();