import { AppError } from "../../../helpers/AppError";
import areaRepository from "../../master-data/repositories/area.repository";
import cityRepository from "../../master-data/repositories/city.repository";
import addressRepository from "../repositories/address.repository";

interface CreateAddressDto {
  userId: string;
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

class CreateAddressService {
  async execute(data: CreateAddressDto) {

    // Validate City
    const city = await cityRepository.findById(data.cityId);

    if (!city) {
      throw new AppError("City not found", 404);
    }

    // Validate Area
    const area = await areaRepository.findById(data.areaId);

    if (!area) {
      throw new AppError("Area not found", 404);
    }

    // Ensure Area belongs to City
    if (area.cityId !== data.cityId) {
      throw new AppError(
        "Selected area does not belong to selected city",
        400
      );
    }

    // If default, remove previous default
    if (data.isDefault) {
      await addressRepository.removeDefault(data.userId);
    }

    return addressRepository.create({
      ...data,
      status: "ACTIVE",
    });
  }
  
}

export default new CreateAddressService();