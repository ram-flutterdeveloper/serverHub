// import ServiceCity from "../models/service-city.model";


// class ServiceCityRepository {

//   async findByService(serviceId: string) {
//     return ServiceCity.findAll({
//       where: {
//         serviceId,
//       },

//       order: [
//         ["createdAt", "ASC"],
//       ],
//     });
//   }


//   async findByServiceAndCity(
//     serviceId: string,
//     cityId: string
//   ) {
//     return ServiceCity.findOne({
//       where: {
//         serviceId,
//         cityId,
//       },
//     });
//   }


//   async create(
//     serviceId: string,
//     cityId: string
//   ) {
//     return ServiceCity.create({
//       serviceId,
//       cityId,
//       status: "ACTIVE",
//     });
//   }


//   async updateStatus(
//     serviceId: string,
//     cityId: string,
//     status: "ACTIVE" | "INACTIVE"
//   ) {
//     return ServiceCity.update(
//       {
//         status,
//       },
//       {
//         where: {
//           serviceId,
//           cityId,
//         },
//       }
//     );
//   }


//   async findActiveByService(
//     serviceId: string
//   ) {
//     return ServiceCity.findAll({
//       where: {
//         serviceId,
//         status: "ACTIVE",
//       },

//       order: [
//         ["createdAt", "ASC"],
//       ],
//     });
//   }

// }

// export default new ServiceCityRepository();

import {
    Transaction,
} from "sequelize";
import ServiceCity from "../models/service-city.model";




class ServiceCityRepository {

    async findByService(
        serviceId: string,
        transaction?: Transaction
    ) {

        return ServiceCity.findAll({

            where: {
                serviceId,
            },

            transaction,

            paranoid: true,

        });
    }


    async findByServiceAndCity(
        serviceId: string,
        cityId: string,
        transaction?: Transaction
    ) {

        return ServiceCity.findOne({

            where: {
                serviceId,
                cityId,
            },

            transaction,

            paranoid: false,

        });
    }


    async create(
        serviceId: string,
        cityId: string,
        transaction?: Transaction
    ) {

        return ServiceCity.create(
            {
                serviceId,
                cityId,
                status: "ACTIVE",
            },
            {
                transaction,
            }
        );
    }


    async updateStatus(
        serviceId: string,
        cityId: string,
        status: "ACTIVE" | "INACTIVE",
        transaction?: Transaction
    ) {

        return ServiceCity.update(
            {
                status,
            },
            {
                where: {
                    serviceId,
                    cityId,
                },

                transaction,
            }
        );
    }


    async findActiveByService(
        serviceId: string,
        transaction?: Transaction
    ) {

        return ServiceCity.findAll({

            where: {
                serviceId,
                status: "ACTIVE",
            },

            transaction,

            order: [
                ["createdAt", "ASC"],
            ],
        });
    }

}


export default new ServiceCityRepository();