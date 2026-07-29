import providerRepository from "../repositories/provider.repository";
import providerServiceRepository from "../repositories/provider-service.repository";
import serviceRepository from "../../master-data/repositories/service.repository";
import { AppError } from "../../../helpers/AppError";

class ProviderServiceService {

  async add(userId: string, serviceId: string) {

    const provider = await providerRepository.findByUserId(userId);

    if (!provider) {
      throw new AppError("Provider not found", 404);
    }

    const service = await serviceRepository.findById(serviceId);

    if (!service) {
      throw new AppError("Service not found", 404);
    }

    const exists = await providerServiceRepository.findOne(
      provider.id,
      serviceId
    );

    if (exists) {
      throw new AppError("Service already added", 400);
    }

    return providerServiceRepository.create({
      providerId: provider.id,
      serviceId,
    });
  }

  async getMyServices(userId: string) {

    const provider = await providerRepository.findByUserId(userId);

    if (!provider) {
      throw new AppError("Provider not found", 404);
    }

    return providerServiceRepository.findByProvider(provider.id);
  }
  


  async remove(userId: string, id: string) {

    const provider = await providerRepository.findByUserId(userId);

    if (!provider) {
        throw new AppError("Provider not found", 404);
    }

    const providerService = await providerServiceRepository.findById(id);

    if (!providerService) {
        throw new AppError("Provider service not found", 404);
    }

    if (providerService.providerId !== provider.id) {
        throw new AppError("Unauthorized", 403);
    }

    await providerServiceRepository.delete(id);
}

}

export default new ProviderServiceService();