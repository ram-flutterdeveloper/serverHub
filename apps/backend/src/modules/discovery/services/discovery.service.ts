// import bannerRepository
//   from "../../master-data/repositories/banner.repository";

// import categoryRepository
//   from "../../master-data/repositories/category.repository";

// import cityRepository
//   from "../../master-data/repositories/city.repository";

// import areaRepository
//   from "../../master-data/repositories/area.repository";

// import packageRepository
//   from "../../master-data/repositories/package.repository";

// import serviceRepository
//   from "../../master-data/repositories/service.repository";

// class DiscoveryService {

//   async home(
//     latitude: number,
//     longitude: number
//   ) {

//     // 1. Find nearest city
//     const location =
//       await cityRepository.findNearestCity(
//         latitude,
//         longitude
//       );

//     if (!location) {
//       return {
//         location: null,
//         banners: [],
//         categories: [],
//         featuredServices: [],
//         popularPackages: [],
//         recommendedServices: [],
//       };
//     }

//     const city = location.city;

//     // 2. Find areas of that city
//     const areas = await areaRepository.findByCity(
//       city.id
//     );

//     // 3. Load home data
//     const [
//       banners,
//       categories,
//       featuredServices,
//       popularPackages,
//     ] = await Promise.all([

//       bannerRepository.findHomeBanners(),

//       categoryRepository
//         .findAllWithServices(city.id),


//       serviceRepository.findFeatured(city.id),

//       packageRepository.findPopular(),

//     ]);

//     return {

//       location: {

//         latitude,
//         longitude,

//         city: {
//           id: city.id,
//           name: city.name,
//           state: city.state,
//         },

//         cityDistance:
//           location.distance,

//         areas,

//       },

//       banners,
//       categories,
//       featuredServices,
//       popularPackages,
//       recommendedServices:
//         featuredServices,

//     };
//   }

// }

// export default new DiscoveryService();

import bannerRepository
  from "../../master-data/repositories/banner.repository";

import categoryRepository
  from "../../master-data/repositories/category.repository";

import cityRepository
  from "../../master-data/repositories/city.repository";

import packageRepository
  from "../../master-data/repositories/package.repository";

import serviceRepository
  from "../../master-data/repositories/service.repository";


class DiscoveryService {

  async home(
    latitude: number,
    longitude: number
  ) {

    // 1. Find nearest active city
    const location =
      await cityRepository.findNearestCity(
        latitude,
        longitude
      );

    // 2. No supported city
    if (!location) {
      return {
        location: null,
        banners: [],
        categories: [],
        featuredServices: [],
        popularPackages: [],
        recommendedServices: [],
      };
    }

    const city = location.city;

    // 3. Load city-specific home data
    const [
      banners,
      categories,
      featuredServices,
      popularPackages,
    ] = await Promise.all([

      bannerRepository.findHomeBanners(
    
      ),

      categoryRepository.findAllWithServices(
        city.id
      ),

      serviceRepository.findFeatured(
        city.id
      ),

      packageRepository.findPopular(
        city.id
      ),

    ]);

    return {

      location: {

        latitude,
        longitude,

        city: {
          id: city.id,
          name: city.name,
          state: city.state,
        },

        cityDistance:
          location.distance,
      },

      banners,

      categories,

      featuredServices,

      popularPackages,

      recommendedServices:
        featuredServices,

    };
  }

}

export default new DiscoveryService();