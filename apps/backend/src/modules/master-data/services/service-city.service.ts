// import sequelize from "../../../database/sequelize";

// import serviceRepository
//   from "../repositories/service.repository";

// import serviceCityRepository
//   from "../repositories/service-city.repository";

// import cityRepository
//   from "../repositories/city.repository";


// class ServiceCityService {

//   async updateServiceCities(
//     serviceId: string,
//     cityIds: string[]
//   ) {

//     // ------------------------------------
//     // 1. Check service exists
//     // ------------------------------------

//     const service =
//       await serviceRepository.findById(
//         serviceId
//       );

//     if (!service) {
//       throw new Error(
//         "Service not found"
//       );
//     }


//     // ------------------------------------
//     // 2. Remove duplicate city IDs
//     // ------------------------------------

//     const uniqueCityIds =
//       [...new Set(cityIds)];


//     // ------------------------------------
//     // 3. Check cities
//     // ------------------------------------

//     const cities =
//       await cityRepository.findActiveByIds(
//         uniqueCityIds
//       );


//     // ------------------------------------
//     // 4. Make sure all cities exist
//     // ------------------------------------

//     if (
//       cities.length !==
//       uniqueCityIds.length
//     ) {

//       const foundCityIds =
//         cities.map(
//           city => city.id
//         );

//       const invalidCityIds =
//         uniqueCityIds.filter(
//           id =>
//             !foundCityIds.includes(id)
//         );

//       throw new Error(
//         `Invalid or inactive city IDs: ${invalidCityIds.join(", ")}`
//       );
//     }


//     // ------------------------------------
//     // 5. Transaction
//     // ------------------------------------

//     const transaction =
//       await sequelize.transaction();

//     try {

//       // ----------------------------------
//       // Existing mappings
//       // ----------------------------------

//       const existingMappings =
//         await serviceCityRepository
//           .findByService(serviceId);


//       const existingCityIds =
//         existingMappings.map(
//           item => item.cityId
//         );


//       // ----------------------------------
//       // Deactivate old mappings
//       // ----------------------------------

//       const citiesToDeactivate =
//         existingCityIds.filter(
//           cityId =>
//             !uniqueCityIds.includes(cityId)
//         );


//       for (
//         const cityId
//         of citiesToDeactivate
//       ) {

//         await serviceCityRepository
//           .updateStatus(
//             serviceId,
//             cityId,
//             "INACTIVE"
//           );
//       }


//       // ----------------------------------
//       // Activate / create mappings
//       // ----------------------------------

//       for (
//         const cityId
//         of uniqueCityIds
//       ) {

//         const existing =
//           existingMappings.find(
//             item =>
//               item.cityId === cityId
//           );


//         if (existing) {

//           await serviceCityRepository
//             .updateStatus(
//               serviceId,
//               cityId,
//               "ACTIVE"
//             );

//         } else {

//           await serviceCityRepository
//             .create(
//               serviceId,
//               cityId
//             );
//         }
//       }


//       await transaction.commit();


//       // ----------------------------------
//       // Return final state
//       // ----------------------------------

//       return serviceCityRepository
//         .findActiveByService(
//           serviceId
//         );

//     } catch (error) {

//       await transaction.rollback();

//       throw error;
//     }
//   }

// }


// export default new ServiceCityService();

import sequelize from "../../../database/sequelize";

import serviceRepository
  from "../repositories/service.repository";

import serviceCityRepository
  from "../repositories/service-city.repository";

import cityRepository
  from "../repositories/city.repository";


class ServiceCityService {

  async updateServiceCities(
    serviceId: string,
    cityIds: string[]
  ) {

    // -----------------------------
    // Validate service
    // -----------------------------

    const service =
      await serviceRepository.findById(
        serviceId
      );

    if (!service) {
      throw new Error(
        "Service not found"
      );
    }


    // -----------------------------
    // Remove duplicates
    // -----------------------------

    const uniqueCityIds =
      [...new Set(cityIds)];


    // -----------------------------
    // Validate cities
    // -----------------------------

    const cities =
      await cityRepository.findActiveByIds(
        uniqueCityIds
      );


    if (
      cities.length !==
      uniqueCityIds.length
    ) {

      const foundIds =
        cities.map(
          city => city.id
        );

      const invalidIds =
        uniqueCityIds.filter(
          id =>
            !foundIds.includes(id)
        );

      throw new Error(
        `Invalid or inactive city IDs: ${invalidIds.join(", ")}`
      );
    }


    // -----------------------------
    // Transaction
    // -----------------------------

    return sequelize.transaction(
      async (transaction) => {

        const existing =
          await serviceCityRepository
            .findByService(
              serviceId,
              transaction
            );


        const existingCityIds =
          existing.map(
            item => item.cityId
          );


        // ---------------------------
        // Deactivate removed cities
        // ---------------------------

        const citiesToDeactivate =
          existingCityIds.filter(
            cityId =>
              !uniqueCityIds.includes(
                cityId
              )
          );


        for (
          const cityId
          of citiesToDeactivate
        ) {

          await serviceCityRepository
            .updateStatus(
              serviceId,
              cityId,
              "INACTIVE",
              transaction
            );
        }


        // ---------------------------
        // Activate / create cities
        // ---------------------------

        for (
          const cityId
          of uniqueCityIds
        ) {

          const existingMapping =
            existing.find(
              item =>
                item.cityId === cityId
            );


          if (existingMapping) {

            await serviceCityRepository
              .updateStatus(
                serviceId,
                cityId,
                "ACTIVE",
                transaction
              );

          } else {

            // Check soft-deleted record
            const deletedMapping =
              await serviceCityRepository
                .findByServiceAndCity(
                  serviceId,
                  cityId,
                  transaction
                );


            if (deletedMapping) {

              await serviceCityRepository
                .updateStatus(
                  serviceId,
                  cityId,
                  "ACTIVE",
                  transaction
                );

            } else {

              await serviceCityRepository
                .create(
                  serviceId,
                  cityId,
                  transaction
                );
            }
          }
        }


        // ---------------------------
        // Return active mappings
        // ---------------------------

        return serviceCityRepository
          .findActiveByService(
            serviceId
          );
      }
    );
  }
async getServiceCities(
  serviceId: string
) {

  const service =
    await serviceRepository.findById(
      serviceId
    );

  if (!service) {
    throw new Error(
      "Service not found"
    );
  }

  return serviceCityRepository
    .findActiveByService(
      serviceId
    );
}
}


export default new ServiceCityService();