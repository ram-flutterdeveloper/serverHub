import { AppError } from "../../../helpers/AppError";
import areaRepository from "../../master-data/repositories/area.repository";
import cityRepository from "../../master-data/repositories/city.repository";

import addressRepository from "../repositories/address.repository";


interface UpdateAddressDto {

    cityId: string;

    areaId: string;

    houseNo: string;

    buildingName?: string;

    floor?: string;

    street?: string;

    landmark?: string;

    addressLine: string;

    latitude?: number;

    longitude?: number;

    contactPerson: string;

    contactNumber: string;

    addressType: "HOME" | "WORK" | "OTHER";

    isDefault?: boolean;

}

class UpdateAddressService {

    async execute(

        id: string,

        userId: string,

        data: UpdateAddressDto

    ) {

        const address =
            await addressRepository.getById(id);

        if (!address) {
            throw new AppError(
                "Address not found",
                404
            );
        }

        if (address.userId !== userId) {
            throw new AppError(
                "Unauthorized",
                403
            );
        }

        const city =
            await cityRepository.findById(data.cityId);

        if (!city) {
            throw new AppError(
                "City not found",
                404
            );
        }

        const area =
            await areaRepository.findById(data.areaId);

        if (!area) {
            throw new AppError(
                "Area not found",
                404
            );
        }

        if (area.cityId !== data.cityId) {
            throw new AppError(
                "Area does not belong to city",
                400
            );
        }

        if (data.isDefault) {
            await addressRepository.removeDefault(userId);
        }

        return addressRepository.update(
            id,
            data
        );

    }

}

export default new UpdateAddressService();