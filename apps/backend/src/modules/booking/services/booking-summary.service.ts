import { AppError } from "../../../helpers/AppError";
import packageRepository from "../../master-data/repositories/package.repository";
import serviceRequirementRepository from "../../master-data/repositories/service-requirement.repository";
import addressRepository from "../../profile/repositories/address.repository";
import providerWorkingHourRepository from "../../provider/repositories/provider-working-hour.repository";

class BookingSummaryService {
  async execute(
    userId: string,
    packageId: string
  ) {

    /**
     * Get Package
     */
    const packageData = await packageRepository.findById(packageId);

    if (!packageData) {
      throw new AppError(
        "Package not found",
        404
      );
    }

    /**
     * User Addresses
     */
    const addresses =
      await addressRepository.getByUser(userId);

    /**
     * Service Requirements
     */
    // const requirements =
    //   await serviceRequirementRepository.getByService(
    //     packageData.serviceId
    //   );
    const requirements =
      await serviceRequirementRepository.findByPackage(
        packageData.id
      );

    /**
     * Available Slots
     */
    const availableSlots =
      await providerWorkingHourRepository.getAvailableSlots(
        packageData.serviceId
      );

    /**
     * Price Summary
     */
    const servicePrice = Number(packageData.defaultPrice ?? packageData.offerPrice);

    const discount = 0;

    const tax = 0;

    const extraCharge = 0;

    const total =
      servicePrice + tax + extraCharge - discount;

    return {

      package: {
        id: packageData.id,
        name: packageData.name,
        image: packageData.image,
        duration: packageData.durationMinutes,
        price: servicePrice,
      },

      addresses,

      requirements,

      availableSlots,

      priceSummary: {
        servicePrice,
        discount,
        tax,
        extraCharge,
        total,
      },

      paymentMethod: "COD",

    };
  }
}

export default new BookingSummaryService();