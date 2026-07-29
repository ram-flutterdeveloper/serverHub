
import bannerRepository from "../../master-data/repositories/banner.repository";
import categoryRepository from "../../master-data/repositories/category.repository";
import cityRepository from "../../master-data/repositories/city.repository";
import areaRepository from "../../master-data/repositories/area.repository";
import packageRepository from "../../master-data/repositories/package.repository";
import serviceRepository from "../../master-data/repositories/service.repository";

class DiscoveryService {
  async home(cityId?: string) {
    const [
      banners,
      categories,
      featuredServices,
      popularPackages,
      cities,
      areas,
    ] = await Promise.all([
      bannerRepository.findHomeBanners(),
      categoryRepository.findAllWithServices(),
      serviceRepository.findFeatured(),
      packageRepository.findPopular(),
      cityRepository.findAll(),
      cityId
        ? areaRepository.findByCity(cityId)
        : [],
    ]);

    return {
      location: {
        cities,
        areas,
      },
      banners,
      categories,
      featuredServices,
      popularPackages,
      recommendedServices: featuredServices,
    };
  }
}

export default new DiscoveryService();